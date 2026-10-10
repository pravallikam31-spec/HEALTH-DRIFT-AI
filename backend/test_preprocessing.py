import argparse
import json
from pathlib import Path

import numpy as np
import tensorflow as tf
from PIL import Image


BACKEND_DIR = Path(__file__).resolve().parent
MODEL_PATH = BACKEND_DIR / "best_food_model.keras"
CLASS_NAMES_PATH = BACKEND_DIR / "food_class_names.json"
IMAGE_SIZE = (224, 224)


def find_mobilenetv3_rescaling_layers(layer, inside_mobilenetv3=False):
    inside_mobilenetv3 = inside_mobilenetv3 or "mobilenetv3" in layer.name.lower()
    matches = []
    if inside_mobilenetv3 and isinstance(layer, tf.keras.layers.Rescaling):
        config = layer.get_config()
        if (
            np.isclose(config.get("scale", 0), 1 / 127.5)
            and np.isclose(config.get("offset", 0), -1.0)
        ):
            matches.append(layer)

    for child_layer in getattr(layer, "layers", []):
        matches.extend(
            find_mobilenetv3_rescaling_layers(child_layer, inside_mobilenetv3)
        )
    return matches


def print_top_five(label, prediction, class_names):
    top_indices = np.argsort(prediction)[-5:][::-1]
    print(f"\n{label}:")
    for index in top_indices:
        confidence = float(prediction[index]) * 100
        print(f"  {class_names[index]}: {confidence:.2f}%")


def main():
    parser = argparse.ArgumentParser(
        description="Compare raw and normalized model image preprocessing."
    )
    parser.add_argument("image_path", type=Path, help="Path to an image file")
    args = parser.parse_args()

    if not args.image_path.is_file():
        parser.error(f"Image file does not exist: {args.image_path}")

    with CLASS_NAMES_PATH.open("r", encoding="utf-8") as class_names_file:
        class_names = json.load(class_names_file)

    if not isinstance(class_names, list) or not all(
        isinstance(name, str) for name in class_names
    ):
        raise ValueError("food_class_names.json must contain a JSON array of class names.")

    model = tf.keras.models.load_model(MODEL_PATH)
    if len(model.output_shape) != 2 or model.output_shape[-1] != len(class_names):
        raise ValueError("Model output does not match the class names.")

    with Image.open(args.image_path) as source_image:
        image = source_image.convert("RGB").resize(IMAGE_SIZE)

    raw_image = np.expand_dims(np.asarray(image, dtype=np.float32), axis=0)
    normalized_image = raw_image / 255.0

    raw_predictions = np.asarray(model.predict(raw_image, verbose=0))[0]
    normalized_predictions = np.asarray(model.predict(normalized_image, verbose=0))[0]

    rescaling_layers = find_mobilenetv3_rescaling_layers(model)
    print(
        "MobileNetV3 preprocessing/rescaling layer present: "
        f"{'Yes' if rescaling_layers else 'No'}"
    )
    for layer in rescaling_layers:
        config = layer.get_config()
        print(
            f"  {layer.name}: scale={config['scale']}, offset={config['offset']}"
        )

    print_top_five("Raw preprocessing (0-255)", raw_predictions, class_names)
    print_top_five(
        "Normalized preprocessing (0-1)", normalized_predictions, class_names
    )


if __name__ == "__main__":
    main()
