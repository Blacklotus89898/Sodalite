import math
import requests
from pathlib import Path


def download_tile_and_bounds(zoom: int, x: int, y: int, output_file: str):
    """
    Downloads a single tile and prints Leaflet bounds.

    Args:
        zoom: OSM zoom level
        x: tile x index
        y: tile y index
        output_file: local path to save the tile image
    """
    url = f"https://a.tile.openstreetmap.org/{zoom}/{x}/{y}.png"
    headers = {
        "User-Agent": "StaticMapDownloader/1.0 (your-email@example.com)"
    }

    print(f"[INFO] Downloading {url}")
    resp = requests.get(url, headers=headers, timeout=10)
    resp.raise_for_status()

    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(resp.content)
    print(f"[OK] Saved to {output_path.resolve()}")

    bounds = tile_bounds(zoom, x, y)
    print(f"[INFO] Leaflet Bounds:\n{bounds[0]}  // SW\n{bounds[1]}  // NE")
    return bounds


def tile_bounds(zoom: int, x: int, y: int):
    """
    Returns [[latSW, lonSW], [latNE, lonNE]] for tile x,y at given zoom.
    """

    def num2deg(xtile, ytile, zoom):
        n = 2.0 ** zoom
        lon_deg = xtile / n * 360.0 - 180.0
        lat_rad = math.atan(math.sinh(math.pi * (1 - 2 * ytile / n)))
        lat_deg = math.degrees(lat_rad)
        return lat_deg, lon_deg

    lat_sw, lon_sw = num2deg(x, y + 1, zoom)
    lat_ne, lon_ne = num2deg(x + 1, y, zoom)

    return [[lat_sw, lon_sw], [lat_ne, lon_ne]]


if __name__ == "__main__":
    # These must match what you’ll use in React
    zoom = 13
    x = 4093
    y = 2723
    output_file = f"static_map_tile_{zoom}_{x}_{y}.png"

    bounds = download_tile_and_bounds(zoom, x, y, output_file)

    print("\n👉 Paste into React:")
    print(f"const imageUrl = '/Sodalite/{output_file}';")
    print(f"const bounds = {bounds};  // SW and NE")
