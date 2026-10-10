import argparse
import json
import mimetypes
import uuid
from pathlib import Path
from urllib.request import Request, urlopen


API_URL = "http://127.0.0.1:5000/predict"


def main():
    parser = argparse.ArgumentParser(
        description="Upload an image to the local food prediction API."
    )
    parser.add_argument("image_path", type=Path, help="Path to an image file")
    args = parser.parse_args()

    if not args.image_path.is_file():
        parser.error(f"Image file does not exist: {args.image_path}")

    boundary = uuid.uuid4().hex
    content_type = mimetypes.guess_type(args.image_path.name)[0]
    if content_type is None:
        content_type = "application/octet-stream"

    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="image"; filename="{args.image_path.name}"\r\n'
        f"Content-Type: {content_type}\r\n\r\n"
    ).encode("utf-8")
    body += args.image_path.read_bytes()
    body += f"\r\n--{boundary}--\r\n".encode("utf-8")

    request = Request(
        API_URL,
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST",
    )

    with urlopen(request) as response:
        result = json.loads(response.read().decode("utf-8"))
        print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
