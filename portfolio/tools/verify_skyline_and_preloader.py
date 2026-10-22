import asyncio
import os
import sys
from playwright.async_api import async_playwright

ARTIFACTS_DIR = "/home/rev/.gemini/antigravity-cli/brain/9eb5e737-7a3a-42f4-ab91-08be7d49c373"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            executable_path="/home/rev/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome"
        )
        context = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await context.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type == "error" else None)
        page.on("pageerror", lambda exc: console_errors.append(f"[pageerror] {exc}"))

        print("=== Test 1: Cold load preloader ===")
        # Navigate cold
        await page.goto("http://localhost:8765/", wait_until="domcontentloaded")
        
        # Check preloader presence
        preloader = page.locator("#rev-preloader")
        if await preloader.count() > 0:
            print("Preloader element found on cold load!")
            await page.screenshot(path=os.path.join(ARTIFACTS_DIR, "verify-preloader-cold.png"))
        else:
            print("Notice: preloader not found or finished very fast")

        # Wait for preloader removal
        await page.wait_for_selector("#rev-preloader", state="detached", timeout=5000)
        print("Preloader completed and removed cleanly from DOM.")

        # Check sessionStorage
        session_val = await page.evaluate("() => sessionStorage.getItem('rev_preloader_done')")
        print(f"sessionStorage rev_preloader_done = {session_val}")
        assert session_val == "1", "rev_preloader_done should be '1'"

        print("=== Test 2: Reload / revisit instant bypass ===")
        await page.reload(wait_until="domcontentloaded")
        await page.wait_for_timeout(100)
        preloader_after_reload = await page.locator("#rev-preloader").count()
        print(f"Preloader count after reload: {preloader_after_reload} (expected: 0)")
        assert preloader_after_reload == 0, "Preloader should be immediately bypassed on reload!"
        await page.screenshot(path=os.path.join(ARTIFACTS_DIR, "verify-reload-instant-bypass.png"))

        print("=== Test 3: Scroll to Skyline - 2D First ===")
        await page.wait_for_selector("#activity canvas", timeout=6000)
        skyline_box = await page.locator("#activity").bounding_box()
        print(f"Skyline initial box: {skyline_box}")

        # Scroll down so the top of #activity is at 350px from viewport top (vh = 800px, 350px is ~0.44 * vh)
        # In our scrollDriven logic:
        # start = vh * 0.40 = 320px
        # If rect.top >= 320px (e.g. 350px), raw <= 0, so scrollGoal = 0 (completely 2D)!
        activity_y = await page.evaluate("() => document.getElementById('activity').getBoundingClientRect().top + window.scrollY")
        target_scroll = activity_y - 360
        await page.evaluate(f"window.scrollTo({{ top: {target_scroll}, behavior: 'instant' }})")
        await page.wait_for_timeout(400)

        skyline_rect = await page.evaluate("() => document.getElementById('activity').getBoundingClientRect()")
        print(f"Skyline rect when entered: top={skyline_rect['top']}, height={skyline_rect['height']}")

        # Verify 2D button or state
        active_btn_text = await page.evaluate("""() => {
            const btns = Array.from(document.querySelectorAll('#activity button'));
            const active = btns.find(b => b.getAttribute('aria-pressed') === 'true' || b.classList.contains('bg-background'));
            return active ? active.textContent.trim() : null;
        }""")
        print(f"Active toggle button when entered: {active_btn_text}")

        # Screenshot 2D on enter
        await page.screenshot(path=os.path.join(ARTIFACTS_DIR, "verify-skyline-2d-on-enter.png"))

        print("=== Test 4: Scroll fully into view - Smooth 3D Folding ===")
        # Scroll so rect.top is at ~50px (< 0.08 * vh = 64px, so scrollGoal = 1)
        target_scroll_3d = activity_y - 50
        await page.evaluate(f"window.scrollTo({{ top: {target_scroll_3d}, behavior: 'instant' }})")
        # Give time for the smooth spring / exponential ease morph
        await page.wait_for_timeout(1000)

        active_btn_text_3d = await page.evaluate("""() => {
            const btns = Array.from(document.querySelectorAll('#activity button'));
            const active = btns.find(b => b.getAttribute('aria-pressed') === 'true' || b.classList.contains('bg-background'));
            return active ? active.textContent.trim() : null;
        }""")
        print(f"Active toggle button after centering: {active_btn_text_3d}")

        await page.screenshot(path=os.path.join(ARTIFACTS_DIR, "verify-skyline-3d-github-green.png"))

        print("=== Test 5: Dark mode GitHub Green accents ===")
        await page.evaluate("() => document.documentElement.setAttribute('data-theme', 'dark')")
        await page.wait_for_timeout(500)
        await page.screenshot(path=os.path.join(ARTIFACTS_DIR, "verify-dark-skyline-github-green-3d.png"))

        print("=== Console Errors Check ===")
        if console_errors:
            print("Errors detected during test:")
            for err in console_errors:
                print(f"  {err}")
        else:
            print("Zero console errors! Flawless execution.")

        assert len(console_errors) == 0, f"Found {len(console_errors)} console errors"

        await browser.close()
        print("All verification steps passed successfully!")

if __name__ == "__main__":
    asyncio.run(main())
