# 🖼️ IMAGE FIX GUIDE - CRITICAL

## ❗ Why Images Aren't Showing

Your images work in Obsidian and GitHub because they use relative paths:
```markdown
![](assets/image.png)
```

But Jekyll (GitHub Pages) needs **absolute paths with Liquid tags**:
```markdown
![Description]({{ '/full/path/to/assets/image.png' | relative_url }})
```

---

## 🔧 Quick Fix Options

### **Option 1: Automated Script (Fastest)**

Run this in your repo directory:

```bash
# Fix THM write-ups
find "THM Red Labs/THM Challenge Rooms - Red Easy" -name "*.md" -type f -exec sed -i 's|!\[\](assets/\([^)]*\))|![](\{\{ "/THM Red Labs/THM Challenge Rooms - Red Easy/assets/\1" \| relative_url \}\})|g' {} \;

find "THM Red Labs/THM Challenge Rooms - Red Medium" -name "*.md" -type f -exec sed -i 's|!\[\](assets/\([^)]*\))|![](\{\{ "/THM Red Labs/THM Challenge Rooms - Red Medium/assets/\1" \| relative_url \}\})|g' {} \;

find "THM Red Labs/THM Challenge Rooms - Red Hard" -name "*.md" -type f -exec sed -i 's|!\[\](assets/\([^)]*\))|![](\{\{ "/THM Red Labs/THM Challenge Rooms - Red Hard/assets/\1" \| relative_url \}\})|g' {} \;

# Fix HTB write-ups
find "HTB Labs" -name "*.md" -type f -exec sed -i 's|!\[\](assets/\([^)]*\))|![](\{\{ "/HTB Labs/assets/\1" \| relative_url \}\})|g' {} \;
```

**For Mac/BSD** (uses different sed syntax):
```bash
# Fix THM write-ups
find "THM Red Labs/THM Challenge Rooms - Red Easy" -name "*.md" -type f -exec sed -i '' 's|!\[\](assets/\([^)]*\))|![](\{\{ "/THM Red Labs/THM Challenge Rooms - Red Easy/assets/\1" \| relative_url \}\})|g' {} \;

find "THM Red Labs/THM Challenge Rooms - Red Medium" -name "*.md" -type f -exec sed -i '' 's|!\[\](assets/\([^)]*\))|![](\{\{ "/THM Red Labs/THM Challenge Rooms - Red Medium/assets/\1" \| relative_url \}\})|g' {} \;

find "THM Red Labs/THM Challenge Rooms - Red Hard" -name "*.md" -type f -exec sed -i '' 's|!\[\](assets/\([^)]*\))|![](\{\{ "/THM Red Labs/THM Challenge Rooms - Red Hard/assets/\1" \| relative_url \}\})|g' {} \;

# Fix HTB write-ups
find "HTB Labs" -name "*.md" -type f -exec sed -i '' 's|!\[\](assets/\([^)]*\))|![](\{\{ "/HTB Labs/assets/\1" \| relative_url \}\})|g' {} \;
```

Then:
```bash
git add .
git commit -m "Fix image paths for Jekyll"
git push
```

---

### **Option 2: Manual Fix (More Control)**

For each write-up file:

**Before:**
```markdown
> [!summary]
> Room description

![](assets/screenshot1.png)

Some text here.

![](assets/nmap-scan.png)
```

**After:**
```markdown
> [!summary]
> Room description

![Screenshot 1]({{ '/THM Red Labs/THM Challenge Rooms - Red Easy/assets/screenshot1.png' | relative_url }})

Some text here.

![Nmap Scan]({{ '/THM Red Labs/THM Challenge Rooms - Red Easy/assets/nmap-scan.png' | relative_url }})
```

**Pattern:**
```
![](assets/IMAGE.png)
↓
![Description]({{ '/FULL/PATH/TO/assets/IMAGE.png' | relative_url }})
```

---

## 📂 Path Examples

### **THM Easy:**
```markdown
![](assets/image.png)
↓
![Image]({{ '/THM Red Labs/THM Challenge Rooms - Red Easy/assets/image.png' | relative_url }})
```

### **THM Medium:**
```markdown
![](assets/image.png)
↓
![Image]({{ '/THM Red Labs/THM Challenge Rooms - Red Medium/assets/image.png' | relative_url }})
```

### **THM Hard:**
```markdown
![](assets/image.png)
↓
![Image]({{ '/THM Red Labs/THM Challenge Rooms - Red Hard/assets/image.png' | relative_url }})
```

### **HTB:**
```markdown
![](assets/image.png)
↓
![Image]({{ '/HTB Labs/assets/image.png' | relative_url }})
```

---

## 🎯 Images Inside Callouts

If your images are inside Obsidian callouts:

**Before:**
```markdown
> [!note] Nmap Scan
> ![](assets/nmap.png)
```

**After:**
```markdown
> [!note] Nmap Scan
> ![Nmap Results]({{ '/THM Red Labs/THM Challenge Rooms - Red Easy/assets/nmap.png' | relative_url }})
```

Callouts work fine in Jekyll - they're just blockquotes. Images inside them need fixing too.

---

## ✅ Verify It Worked

1. Push changes
2. Wait 2-3 minutes for GitHub Pages rebuild
3. Open a write-up page
4. Images should display

**Still broken?**
- Check browser console (F12) for 404 errors on images
- Verify image files exist in `assets/` folders
- Confirm image filenames match exactly (case-sensitive!)
- Check path doesn't have typos

---

## 🔄 Future Write-ups

When adding NEW write-ups:

**Option A: Use Jekyll format from start:**
```markdown
![Description]({{ '/path/to/assets/image.png' | relative_url }})
```

**Option B: Keep using Obsidian format:**
```markdown
![](assets/image.png)
```
Then run the fix script before deploying.

---

## 🚨 Common Mistakes

**❌ Wrong:**
```markdown
![](./assets/image.png)           # ./ doesn't work
![](/assets/image.png)             # Missing full path
![](assets/image.png)              # Relative path
<img src="assets/image.png">       # HTML without Liquid
```

**✅ Correct:**
```markdown
![Alt text]({{ '/Full/Path/To/assets/image.png' | relative_url }})
```

---

## 💡 Why This Matters

Jekyll builds static HTML from your markdown. When it sees:
```markdown
![](assets/image.png)
```

It looks for `assets/image.png` **relative to the current page URL**, not your repo structure.

By using:
```markdown
{{ '/THM Red Labs/.../assets/image.png' | relative_url }}
```

You're telling Jekyll: "Start from the site root, then go to this path."

The `relative_url` filter adds your `baseurl` automatically, so it works on GitHub Pages.

---

**TL;DR:** Run the script, push, wait 3 minutes, images work. ✅
