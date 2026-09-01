from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return{
        "status":"success",
        "message": "AI Service home page is running",
    }

@app.get("/health")
def health_check():
    return {
        "status": "success",
        "message": "AI service is working"
    }