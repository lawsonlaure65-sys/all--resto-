import urllib.request
import re
import json

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
url = "https://khadysfood.vercel.app"

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, timeout=10) as resp:
    html = resp.read().decode("utf-8", errors="ignore")
    print("HTML length:", len(html))
    scripts = re.findall(r'src=["\']([^"\']+)["\']', html)
    print("Scripts:", scripts)
    title = re.search(r'<title>(.*?)</title>', html)
    print("Title:", title.group(1) if title else "None")

for script in scripts:
    script_url = script if script.startswith("http") else url + script
    print("\nFetching script:", script_url)
    try:
        s_req = urllib.request.Request(script_url, headers=headers)
        with urllib.request.urlopen(s_req, timeout=10) as s_resp:
            js = s_resp.read().decode("utf-8", errors="ignore")
            print("Script size:", len(js))
            # Find any mentions of plat du jour or dishes
            matches = re.findall(r'plat_du_jour[^;]{1,200}', js, re.IGNORECASE)
            print("Matches plat_du_jour:", matches[:5])
            matches2 = re.findall(r'plat[ _]du[ _]jour|du jour|menu du jour|plat du jour', js, re.IGNORECASE)
            print("Count mentions of du jour:", len(matches2))
            # Look for supabase or api urls
            supa = re.findall(r'https://[a-zA-Z0-9_\-\.]+\.supabase\.co', js)
            print("Supabase URLs:", list(set(supa)))
            # Look for keys
            keys = re.findall(r'eyJ[a-zA-Z0-9_\-\.]{50,}', js)
            print("JWT keys count:", len(keys))
            if keys:
                print("First key sample:", keys[0][:30])
    except Exception as e:
        print("Script fetch error:", e)
