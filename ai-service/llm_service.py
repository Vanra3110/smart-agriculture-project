import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)

def generate_crop_explanation(
    crop: str,
    confidence: float,
    N: float,
    P: float,
    K: float,
    ph: float,
    humidity: float,
    temperature: float,
    rainfall: float,   
)->str:
    prompt = f"""
    You are an agricultural assistant.

    A machine learning model recommended the crop "{crop}" with a model confidence of {confidence *100:.2f}%.

    The field conditions are:

    Nitrogen (N): {N}
    Phosphorus (P): {P}
    Potassium (K): {K}
    pH: {ph}
    Humidity: {humidity}%
    Temperature: {temperature}C
    Rainfall: {rainfall}mm

    Explain in simple language why this crop may be suitable for these conditons.

    Give:
    1. A short explanation of the recommendation.
    2. Three important farming considerations.

    Do not say that the crop is guaranteed to succeed. 
    Clearly mention that this is an AI-based recommendation.
    """

    try:
        response = client.chat.completions.create(
            model="gemini-3.5-flash-lite",
            messages=[
                {
                    "role": "system", 
                    "content": "You are a helpful agricultural assistant."},
                {
                    "role": "user", 
                    "content": prompt
                },
            ],
        )

        return response.choices[0].message.content or "Unable to generate explanation."
    
    except Exception as e:
        return f"Error generating explanation: {str(e)}"