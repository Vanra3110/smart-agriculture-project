from services.crop_service import predict_crop
from schemas import CropInput


input_data = CropInput(
    N=120,
    P=45,
    K=40,
    temperature=27.0,
    humidity=60.0,
    ph=6.5,
    rainfall=100.0
)

crop_recommendation = predict_crop(input_data)

print(crop_recommendation)