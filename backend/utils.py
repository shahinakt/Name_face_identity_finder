import numpy as np
import os
from PIL import Image
import cv2

def cosine_similarity(vec1, vec2):
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

def cleanup_file(path):
    if os.path.exists(path):
        os.remove(path)

def preprocess_image_for_face_detection(image_path):
    """
    Preprocess image to improve face detection chances
    """
    try:
        # Load image
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Could not load image")
        
        # Convert to RGB (DeepFace expects RGB)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Resize if image is too large (can help with detection)
        height, width = img_rgb.shape[:2]
        max_size = 1024
        
        if max(height, width) > max_size:
            if width > height:
                new_width = max_size
                new_height = int(height * (max_size / width))
            else:
                new_height = max_size
                new_width = int(width * (max_size / height))
            
            img_rgb = cv2.resize(img_rgb, (new_width, new_height))
        
        # Save preprocessed image
        pil_img = Image.fromarray(img_rgb)
        pil_img.save(image_path)
        
        return True
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return False
