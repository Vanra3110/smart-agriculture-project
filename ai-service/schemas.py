from pydantic import BaseModel, Field


class CropInput(BaseModel):
    N: float = Field(..., ge=0, description="Nitrogen level")
    P: float = Field(..., ge=0, description="Phosphorus level")
    K: float = Field(..., ge=0, description="Potassium level")

    temperature: float = Field(
        ...,
        ge=-50,
        le=60,
        description="Temperature in Celsius"
    )

    humidity: float = Field(
        ...,
        ge=0,
        le=100,
        description="Humidity percentage"
    )

    ph: float = Field(
        ...,
        ge=0,
        le=14,
        description="Soil pH"
    )

    rainfall: float = Field(
        ...,
        ge=0,
        description="Rainfall in mm"
    )