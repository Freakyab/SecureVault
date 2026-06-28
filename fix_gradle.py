import os

file_path = 'android/app/build.gradle'
if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We target the specific problematic line
    # Note: the exact string might vary slightly due to quotes
    target = 'entryFile = file(["node", "-e", "require('expo/scripts/resolveAppEntry')", projectRoot, "android", "absolute"].execute(null, rootDir).text.trim())'
    replacement = 'entryFile = file("../index.js")'
    
    if target in content:
        new_content = content.replace(target, replacement)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Successfully replaced entryFile path.")
    else:
        # Try a more flexible replacement if the exact string isn't found
        import re
        pattern = r'entryFile\s*=\s*file\(\[.*?\].execute\(.*?\).text\.trim\(\)\)'
        if re.search(pattern, content):
            new_content = re.sub(pattern, replacement, content)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("Successfully replaced entryFile path using regex.")
        else:
            print("Could not find the target line in build.gradle")
else:
    print(f"File {file_path} not found")
