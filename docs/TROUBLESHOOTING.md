# Troubleshooting Guide - ATS Project

## Common Issues and Fixes

### 1. JSON Serialization Error (TypeError)

**Error:**
```
TypeError: keys must be str, int, float, bool or None, not int32
```

**Cause:** Numpy/Pandas integer types (int32, int64) cannot be used as JSON dictionary keys.

**Fix:** ✅ Already fixed in Notebook 04, cell 30. The code now converts keys to strings:
```python
cluster_names_str = {str(k): v for k, v in cluster_names.items()}
json.dump(cluster_names_str, f, indent=2)
```

**If you see this elsewhere:** Convert numpy types to Python native types:
```python
# For dictionary keys
my_dict_str = {str(k): v for k, v in my_dict.items()}

# For single values
int(numpy_int32_value)  # Convert to Python int
str(numpy_value)        # Convert to string
```

---

### 2. Module Not Found Errors

**Error:**
```
ModuleNotFoundError: No module named 'pandas'
```

**Fix:**
```bash
cd ml
source venv/bin/activate  # Activate virtual environment
pip install -r requirements.txt
```

---

### 3. spaCy Model Not Found

**Error:**
```
OSError: Can't find model 'en_core_web_sm'
```

**Fix:**
```bash
python -m spacy download en_core_web_sm
```

---

### 4. File Not Found: Models or Data

**Error:**
```
FileNotFoundError: [Errno 2] No such file or directory: '../models/...'
```

**Cause:** Notebooks must be run in order. Some notebooks depend on outputs from previous ones.

**Fix:** Run notebooks in this order:
1. 01_data_acquisition_and_exploration.ipynb
2. 02_data_preprocessing_and_cleaning.ipynb
3. 03_feature_engineering.ipynb
4. 04_clustering_analysis.ipynb
5. 05_scoring_and_ranking.ipynb
6. 06_statistical_validation.ipynb

---

### 5. Empty or Missing Features

**Error:**
```
KeyError: 'Resume_Clean'
```

**Cause:** Feature not created in previous notebook.

**Fix:**
- Make sure notebook 02 (preprocessing) completed successfully
- Check that `resumes_cleaned.csv` exists in `ml/data/processed/`
- Re-run notebook 02 if needed

---

### 6. Memory Issues with t-SNE

**Error:**
```
MemoryError or very slow t-SNE execution
```

**Fix:** Reduce dataset size or skip t-SNE:
```python
# In notebook 04, modify t-SNE cell:
# Sample data before t-SNE
sample_size = min(500, len(X))  # Reduce from full dataset
X_sample = X.sample(n=sample_size, random_state=42)
tsne = TSNE(n_components=2, random_state=42, perplexity=30)
X_tsne = tsne.fit_transform(X_sample)

# Only assign to sampled rows
df.loc[X_sample.index, 'TSNE1'] = X_tsne[:, 0]
df.loc[X_sample.index, 'TSNE2'] = X_tsne[:, 1]
```

---

### 7. Pandas Warning: SettingWithCopyWarning

**Warning:**
```
SettingWithCopyWarning: A value is trying to be set on a copy of a slice
```

**Fix:** Use `.loc[]` or `.copy()`:
```python
# Instead of:
df_subset = df[df['condition']]
df_subset['new_col'] = value

# Use:
df_subset = df[df['condition']].copy()
df_subset['new_col'] = value
```

---

### 8. Jupyter Kernel Crashes

**Issue:** Kernel dies or restarts unexpectedly

**Possible Causes:**
- Large dataset causing memory overflow
- Infinite loop in code
- Conflicting package versions

**Fixes:**
1. Restart kernel and clear outputs: Kernel → Restart & Clear Output
2. Run cells one at a time to identify problem cell
3. Check memory usage: reduce dataset size if needed
4. Update packages:
```bash
pip install --upgrade pandas numpy scikit-learn
```

---

### 9. Scoring Config or Features Not Found

**Error:**
```
FileNotFoundError: '../models/scoring_config.json'
```

**Cause:** Notebook 05 (scoring) not run yet.

**Fix:**
- Run notebook 05 first
- This creates `scoring_config.json` and other scoring artifacts

---

### 10. Cluster Names Not Loading Correctly

**Issue:** After fixing the JSON error, cluster names might load as strings

**Fix:** When loading cluster names, convert keys back:
```python
# Load cluster names
with open('../models/cluster_names.json', 'r') as f:
    cluster_names_str = json.load(f)

# Convert string keys back to integers
cluster_names = {int(k): v for k, v in cluster_names_str.items()}
```

---

## Environment Issues

### Virtual Environment Not Activating

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

**Still not working?**
```bash
python3 -m venv venv --clear  # Recreate environment
source venv/bin/activate
pip install -r requirements.txt
```

---

### Package Version Conflicts

**Issue:** Incompatible package versions

**Fix:**
```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

---

## Notebook Execution Tips

### Best Practices

1. **Always activate virtual environment first**
```bash
cd ml
source venv/bin/activate
jupyter notebook
```

2. **Run cells sequentially** - Don't skip cells

3. **Restart kernel if you edit code** - Kernel → Restart & Run All

4. **Check for errors** - Read error messages carefully

5. **Save frequently** - Cmd/Ctrl + S

---

## Getting Help

If you encounter an error not listed here:

1. **Read the full error message** - The last line shows the error type
2. **Check which cell failed** - Look at the cell number
3. **Verify previous notebooks ran successfully**
4. **Check that files exist** in `ml/data/processed/` and `ml/models/`
5. **Look for typos** in file paths

---

## Quick Fixes Checklist

- [ ] Virtual environment activated?
- [ ] All packages installed? (`pip list`)
- [ ] spaCy model downloaded?
- [ ] Notebooks run in correct order (01 → 06)?
- [ ] Previous notebooks completed successfully?
- [ ] Required files exist in `data/processed/` and `models/`?
- [ ] Enough disk space and memory?

---

## Still Having Issues?

Check these files for correctness:
1. `ml/data/raw/synthetic_resumes.csv` - Should have 800+ rows
2. `ml/data/processed/resumes_cleaned.csv` - Created by notebook 02
3. `ml/data/processed/resumes_with_features.csv` - Created by notebook 03
4. `ml/models/tfidf_vectorizer.pkl` - Created by notebook 03
5. `ml/models/kmeans_model.pkl` - Created by notebook 04

All good? Great! Continue with your analysis 🚀
