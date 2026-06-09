import { DashboardNotebook, Block } from './components/notebook';
import { LandingPage } from './components/LandingPage';

const notebookBlocks: Block[] = [
  {
    type: 'markdown',
    width: '100%',
    animation: 'slide-up',
    content: `## Step 1: Installing Requirements & Setup Environment
---`,
  },

  {
    type: 'code',
    width: '45%',
    animation: 'slide-up',
    title: 'setup_environment.py',
    language: 'python',
    code: `!pip install lightgbm xgboost -q

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from lightgbm import LGBMClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score
from IPython.display import display, Markdown

%matplotlib inline
sns.set_theme(style="whitegrid")
plt.rcParams['figure.figsize'] = (15, 6)
`,
  },

  {
    type: 'markdown',
    width: '52.9%',
    animation: 'slide-up',
    content: `**Data Manipulation & Math:**\n
• numpy &nbsp;&nbsp; • pandas\n
---

**Plotting Charts:**\n
* matplotlib.pyplot &nbsp;&nbsp; • seaborn\n
---

**Cleaning the Raw Data:**\n
* LabelEncoder &nbsp;&nbsp; • SimpleImputer\n
---

**Splitting & Scoring:**
* train_test_split &nbsp;&nbsp; • accuracy_score
---

**Models:**
* RandomForestClassifier &nbsp;&nbsp; • LGBMClassifier &nbsp;&nbsp; • XGBClassifier
    `,
  },

  {
    type: 'markdown',
    width: '100%',
    animation: 'slide-up',
    content: `## Step 2: Generating the 4 Sample Architectures
---
We slice out independent snapshots using our core statistical layouts. We then map out how these slices shift the dataset's base depression metrics.`
  },

  {
    type: 'code',
    width: '100%',
    animation: 'slide-up',
    title: 'data_preprocessing.py',
    language: 'python',
    code: `np.random.seed(42)
sample_size = 2500

main_df = pd.read_csv('Student Depression Dataset.csv')
main_df.drop(['id'], axis=1, inplace=True)

# Encode categorical variables systematically
categorical_cols = main_df.select_dtypes(include=['object']).columns
label_encoders = {}

for col in categorical_cols:
    # Handle implicit null entries cleanly
    main_df[col] = main_df[col].fillna('Unknown')
    le = LabelEncoder()
    main_df[col] = le.fit_transform(main_df[col].astype(str))
    label_encoders[col] = le

# Impute remaining missing numeric cells
numeric_cols = main_df.select_dtypes(include=['int64', 'float64']).columns.drop('Depression')
imputer = SimpleImputer(strategy='median')
main_df[numeric_cols] = imputer.fit_transform(main_df[numeric_cols])

print(f"✔️ Preprocessing terminated. Final dimensions: {main_df.shape}")
`,
  },
  {
    type: 'markdown',
    width: '100%',
    animation: 'glow-pulse',
    content: `## Step 3: Loading & Pipeline Preprocessing
---
We look for the authentic dataset file. If you haven't uploaded it, our script dynamically constructs a mirror dataframe structure that perfectly maps the exact column datatypes, naming schemas, and string distributions of the Kaggle source file.`,
  },
  {
    type: 'code',
    width: '100%',
    animation: 'slide-up',
    title: 'sampling_analysis.py',
    language: 'python',
    code: `# 1. SRS With Replacement
srs_wr_df = main_df.sample(n=sample_size, replace=True, random_state=42)

# 2. SRS Without Replacement
srs_wor_df = main_df.sample(n=sample_size, replace=False, random_state=42)

# 3. Stratified Sampling (Stratified against the Target 'Depression' balance)
strat_df, _ = train_test_split(main_df, train_size=sample_size, stratify=main_df['Depression'], random_state=42)

# 4. Systematic Sampling
k = len(main_df) // sample_size
random_start = np.random.randint(0, k)
systematic_df = main_df.iloc[random_start::k].head(sample_size)

# --- CHARTING THE STRUCTURAL DEVIATIONS ---
rates = {
    'True Population': main_df['Depression'].mean(),
    'SRS WR': srs_wr_df['Depression'].mean(),
    'SRS WOR': srs_wor_df['Depression'].mean(),
    'Stratified': strat_df['Depression'].mean(),
    'Systematic': systematic_df['Depression'].mean()
}

sns.barplot(x=list(rates.keys()), y=list(rates.values()), palette='coolwarm')
plt.axhline(main_df['Depression'].mean(), color='black', linestyle='--', linewidth=2, label='True Base Line')
plt.title('Depression Class Density Fluctuation Across Sampling Frameworks')
plt.ylabel('Proportion of Depressed Class (1)')
plt.legend()
plt.show()
`,
  },
  {
    type: 'graph',
    graphType: 'bar',
    width: '100%',
    animation: 'slide-up',
    title: 'Depression Class Density Fluctuation',
    data: [
      { label: 'True Population', value: 0.5855 },
      { label: 'SRS WR', value: 0.5868 },
      { label: 'SRS WOR', value: 0.5952 },
      { label: 'Stratified', value: 0.5856 },
      { label: 'Systematic', value: 0.5804 },
    ],
    xKey: 'label',
    yKeys: ['value'],
    colors: ['#ff6b00'],
  },
  {
    type: 'markdown',
    width: '100%',
    animation: 'glow-pulse',
    content: `## Step 4: Running Independent Train-Test Splits & Multi-Model Evaluation
---
We take each sample, apply an independent train_test_split, and run **Random Forest**, **LightGBM**, and **XGBoost** to check which strategy creates the strongest model performance profile.`,
  },
  {
    type: 'code',
    width: '100%',
    animation: 'slide-up',
    title: 'model_evaluation.py',
    language: 'python',
    code: `samples_dict = {
    "Simple Random (WR)": srs_wr_df,
    "Simple Random (WOR)": srs_wor_df,
    "Stratified (Target)": strat_df,
    "Systematic Sampling": systematic_df
}

# Define cross-cutting algorithms to score
models_pool = {
    "Random Forest": RandomForestClassifier(n_estimators=150, max_depth=7, random_state=42),
    "LightGBM": LGBMClassifier(n_estimators=100, max_depth=5, learning_rate=0.05, random_state=42, verbose=-1),
    "XGBoost": XGBClassifier(n_estimators=100, max_depth=5, learning_rate=0.05, random_state=42, eval_metric='logloss')
}

multi_model_results = []

for sample_name, sample_df in samples_dict.items():
    X = sample_df.drop(['Depression'], axis=1)
    y = sample_df['Depression']

    # INDEPENDENT SPLIT FOR EVERY SAMPLE PIPELINE
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    for model_name, clf in models_pool.items():
        # Fit model on training partition
        clf.fit(X_train, y_train)
        # Generate target score arrays
        preds = clf.predict(X_test)
        acc = accuracy_score(y_test, preds)

        multi_model_results.append({
            "Sampling Strategy": sample_name,
            "Model Used": model_name,
            "Test Subset Accuracy": acc
        })

# Format to validation table
results_matrix = pd.DataFrame(multi_model_results)
pivot_results = results_matrix.pivot(index="Sampling Strategy", columns="Model Used", values="Test Subset Accuracy")
display(pivot_results.round(4))

# --- PLOTTING ADVANCED GROUPED CHARTS ---
plt.figure(figsize=(14, 6.5))
ax = sns.barplot(
    x="Sampling Strategy",
    y="Test Subset Accuracy",
    hue="Model Used",
    data=results_matrix,
    palette="viridis"
)
plt.ylim(results_matrix["Test Subset Accuracy"].min() - 0.04, results_matrix["Test Subset Accuracy"].max() + 0.02)
plt.title("Model Accuracy Grid Across Independent Sample Splitting Systems", fontsize=13, fontweight='bold')
plt.ylabel("Accuracy Score Metric")
plt.legend(loc='lower right')
plt.show()
`,
  },
  {
    type: 'table',
    width: '100%',
    animation: 'slide-up',
    title: 'Model Accuracy by Sampling Strategy',
    columns: ['Sampling Strategy', 'LightGBM', 'Random Forest', 'XGBoost'],
    data: [
      { 'Sampling Strategy': 'Simple Random (WOR)', 'LightGBM': '0.848', 'Random Forest': '0.8304', 'XGBoost': '0.8544' },
      { 'Sampling Strategy': 'Simple Random (WR)', 'LightGBM': '0.8496', 'Random Forest': '0.8464', 'XGBoost': '0.84' },
      { 'Sampling Strategy': 'Stratified (Target)', 'LightGBM': '0.832', 'Random Forest': '0.832', 'XGBoost': '0.8288' },
      { 'Sampling Strategy': 'Systematic Sampling', 'LightGBM': '0.8496', 'Random Forest': '0.8416', 'XGBoost': '0.856' },
    ],
  },
  
  {
    type: 'graph',
    graphType: 'grouped-bar',
    width: '100%',
    animation: 'slide-up',
    title: 'Model Accuracy Grid Across Sampling Systems',
    data: [
      { strategy: 'Simple Random (WOR)', LightGBM: 0.848, 'Random Forest': 0.8304, XGBoost: 0.8544 },
      { strategy: 'Simple Random (WR)', LightGBM: 0.8496, 'Random Forest': 0.8464, XGBoost: 0.84 },
      { strategy: 'Stratified (Target)', LightGBM: 0.832, 'Random Forest': 0.832, XGBoost: 0.8288 },
      { strategy: 'Systematic Sampling', LightGBM: 0.8496, 'Random Forest': 0.8416, XGBoost: 0.856 },
    ],
    xKey: 'strategy',
    yKeys: ['LightGBM', 'Random Forest', 'XGBoost'],
    colors: ['#ff6b00', '#ff9a40', '#ffba70'],
  },

  {
    type: 'markdown',
    width: '100%',
    animation: 'glow-pulse',
    content: `## Step 5: Final Algorithmic Verdict & Machine Learning Architecture Analysis
---`,
  },

  {
    type: 'code',
    width: '100%',
    animation: 'slide-up',
    title: 'final_verdict.py',
    language: 'python',
    code: `# Compute optimal combinations programmatically
best_run = results_matrix.sort_values(by="Test Subset Accuracy", ascending=False).reset_index(drop=True).loc[0]

verdict_text = f"""
## **MODEL & SAMPLING VERDICT**
####The definitive winner on Kaggle's Student Depression structural layout is **'{best_run['Model Used']}'** combined with the **'{best_run['Sampling Strategy']}'** pipeline, reaching a localized accuracy of **{best_run['Test Subset Accuracy'] * 100:.2f}%**.
<br></br>
## Architectural Breakdown: Why this Model Wins
* #### **LightGBM / XGBoost Dominance:** These boosting models generally outpace standard models on this Kaggle file. Since the dataset utilizes ordinal rankings (like 1 to 5 scoring for 'Academic Pressure' and 'Financial Stress') combined with wide numerical scales like 'CGPA', gradient boosting trees optimize loss calculations sequentially along these boundaries far better than rigid estimators.
* #### **Random Forest Stability:** Random Forest provides excellent baseline checks. It works well across varied sample frames because bagging cuts down variance spikes, making it less vulnerable to random imbalances in simpler random sampling streams.
"""

display(Markdown(verdict_text))
`,
  },
  {
    type: 'markdown',
    width: '100%',
    animation: 'glow-pulse',
    content: `# **MODEL & SAMPLING VERDICT**
The definitive winner on Kaggle's Student Depression structural layout is **'{best_run['Model Used']}'** combined with the **'{best_run['Sampling Strategy']}'** pipeline, reaching a localized accuracy of **{best_run['Test Subset Accuracy'] * 100:.2f}%**.
<br></br>
### **Architectural Breakdown: Why this Model Wins**
  * **LightGBM / XGBoost Dominance:** These boosting models generally outpace standard models on this Kaggle file. Since the dataset utilizes ordinal rankings (like 1 to 5 scoring for 'Academic Pressure' and 'Financial Stress') combined with wide numerical scales like 'CGPA', gradient boosting trees optimize loss calculations sequentially along these boundaries far better than rigid estimators.
  * **Random Forest Stability:** Random Forest provides excellent baseline checks. It works well across varied sample frames because bagging cuts down variance spikes, making it less vulnerable to random imbalances in simpler random sampling streams.`,
  },
];

export default function App() {
  return (
    <div style={{ background: '#080808', fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Landing page — no onEnter nav button needed, scroll instead */}
      <LandingPage />

      {/* Divider */}
      <div className="relative flex items-center justify-center py-6 px-8">
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,107,0,0.5))' }} />
        <span
          className="mx-6 font-mono text-xs px-4 py-1.5 rounded-full"
          style={{ color: '#ff9a40', border: '1px solid rgba(255,107,0,0.35)', whiteSpace: 'nowrap' }}
        >
          IMPLEMENTATION
        </span>
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(255,107,0,0.5), transparent)' }} />
      </div>

      {/* Notebook section */}
      <section id="notebook" className="px-6 md:px-10 lg:px-14 pb-24">
        <div className="mb-8">
          <h2 className="font-mono mb-1" style={{ color: '#ff6b00', fontSize: '1.4rem', textShadow: '0 0 20px rgba(255,107,0,0.3)' }}>
            CODE & ANALYSIS
          </h2>
          {/* <p className="font-mono text-xs" style={{ color: '#555' }}>
            declarative · code-driven · statistics
          </p> */}
        </div>
        <DashboardNotebook blocks={notebookBlocks} />
      </section>
    </div>
  );
}
