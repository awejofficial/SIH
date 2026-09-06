"""
main.py - FastAPI Application Entry Point (V2)
==============================================
Operational platform entry point. Loads ML artifacts, DB schema, 
and includes all 8 operational routes.
"""

import os
import sys
from contextlib import asynccontextmanager

import joblib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

ML_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "ml"))
sys.path.insert(0, ML_DIR)

from explainer import SHAPExplainer
from app.database import Base, engine

# Init DB for SQLite (if applicable)
Base.metadata.create_all(bind=engine)

app_state = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[INFO] Loading ML model artifacts for V2 Platform...")
    
    model_path = os.path.join(ML_DIR, "delay_model.pkl")
    encoder_path = os.path.join(ML_DIR, "encoder.pkl")
    columns_path = os.path.join(ML_DIR, "feature_columns.pkl")
    
    try:
        app_state["model"] = joblib.load(model_path)
        app_state["encoder"] = joblib.load(encoder_path)
        app_state["feature_columns"] = joblib.load(columns_path)
        app_state["shap_explainer"] = SHAPExplainer()
        print("[OK] All ML artifacts loaded successfully.")
    except Exception as e:
        print(f"[WARN] ML artifact error: {e}")

    # Auto-seed database if empty (ensures GIS map, alerts, & search work immediately on Render)
    try:
        from app.database import SessionLocal, Project
        db = SessionLocal()
        if db.query(Project).count() == 0:
            print("[INFO] Database empty on startup. Auto-seeding initial projects...")
            csv_candidates = [
                os.path.join(ML_DIR, "ongoing_projects.csv"),
                os.path.join(ML_DIR, "land_data.csv"),
            ]
            for csv_file in csv_candidates:
                if os.path.exists(csv_file):
                    import pandas as pd
                    df = pd.read_csv(csv_file).head(100)
                    for _, row in df.iterrows():
                        pid = int(row.get("project_id", 0))
                        p = Project(
                            project_id=pid,
                            project_name=row.get("project_name", f"Project #{pid}"),
                            district=row.get("district", "Pune"),
                            project_type=row.get("project_type", "Highway"),
                            total_acres=float(row.get("total_acres", 100.0)),
                            land_acquired_pct=float(row.get("land_acquired_pct", 50.0)),
                            approval_days_pending=int(row.get("approval_days_pending", 10)),
                            compensation_disbursed_pct=float(row.get("compensation_disbursed_pct", 50.0)),
                            legal_cases_count=int(row.get("legal_cases_count", 0)),
                            ownership_disputes=int(row.get("ownership_disputes", 0)),
                            rnp_progress_pct=float(row.get("rnp_progress_pct", 50.0)),
                            possession_pct=float(row.get("possession_pct", 50.0)),
                            affected_families=int(row.get("affected_families", 20)),
                            doc_deficiency_score=float(row.get("doc_deficiency_score", 0.1)),
                            historical_district_delay_avg=float(row.get("historical_district_delay_avg", 30.0)),
                            risk_score=float(row.get("risk_score", 45.0)) if "risk_score" in row and pd.notna(row["risk_score"]) else 45.0,
                            risk_category=str(row.get("risk_category", "Moderate")) if "risk_category" in row and pd.notna(row["risk_category"]) else "Moderate",
                            lat=float(row.get("lat")) if "lat" in row and pd.notna(row["lat"]) else None,
                            lon=float(row.get("lon")) if "lon" in row and pd.notna(row["lon"]) else None,
                        )
                        db.add(p)
                    db.commit()
                    print(f"[OK] Seeded {len(df)} initial projects into database.")
                    break
        db.close()
    except Exception as e:
        print(f"[WARN] Auto-seeding notice: {e}")
        
    yield
    app_state.clear()
    print("[INFO] Cleaned up ML artifacts.")

app = FastAPI(
    title="Land Acquisition Command Center",
    description="Operational Early-Warning Platform for SIH 2026",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@app.get("/api")
async def root():
    return {
        "name": "SIH26017 Land Acquisition Predictive Intelligence API",
        "status": "operational",
        "version": "2.0.0",
        "model_loaded": "model" in app_state,
        "docs_url": "/docs",
        "health_url": "/health",
        "authority": "Department of Land Resources (DoLR), Ministry of Rural Development, Government of India"
    }

@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {"status": "operational", "model_loaded": "model" in app_state, "version": "2.0.0"}

# ── Routers ──
from app.routes.auth import router as auth_router
from app.routes.ingest import router as ingest_router
from app.routes.status import router as status_router
from app.routes.alerts import router as alerts_router
from app.routes.geo import router as geo_router
from app.routes.predict import router as predict_router
from app.routes.whatif import router as whatif_router
from app.routes.feedback import router as feedback_router
from app.routes.model_health import router as model_health_router

ROUTERS = [
    (auth_router, ["Auth"]),
    (ingest_router, ["Ingest"]),
    (status_router, ["Intervention Tracker"]),
    (alerts_router, ["Alerts"]),
    (geo_router, ["GIS"]),
    (predict_router, ["Prediction"]),
    (whatif_router, ["Simulator"]),
    (feedback_router, ["Learning Loop"]),
    (model_health_router, ["Model Governance"]),
]

for r, tags in ROUTERS:
    app.include_router(r, tags=tags)
    app.include_router(r, prefix="/api", tags=tags)
