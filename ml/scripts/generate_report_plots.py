import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

def generate_plots():
    # Ensure output directory exists
    output_dir = 'docs/images'
    os.makedirs(output_dir, exist_ok=True)

    # Load data
    try:
        df = pd.read_csv('./data/processed/resumes_scored.csv')
        print("Data loaded successfully.")
        print("Columns:", df.columns.tolist())
    except Exception as e:
        print(f"Error loading data: {e}")
        return

    # Set style
    sns.set(style="whitegrid")

    # 1. Score Distribution by Education Level
    if 'Education_Level' in df.columns and 'Final_Score' in df.columns:
        plt.figure(figsize=(10, 6))
        sns.boxplot(x='Education_Level', y='Final_Score', data=df, palette="Set3")
        plt.title('Distribution of Final Scores by Education Level')
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig(f'{output_dir}/score_distribution_education.png')
        print(f"Saved {output_dir}/score_distribution_education.png")
        plt.close()
    else:
        print(f"Columns for Education Level plot missing. Available: {df.columns.tolist()}")

    # 2. Cluster Visualization (TSNE)
    if 'TSNE1' in df.columns and 'TSNE2' in df.columns and 'Cluster_Name' in df.columns:
        plt.figure(figsize=(10, 8))
        scatter = sns.scatterplot(
            x='TSNE1', y='TSNE2', hue='Cluster_Name', 
            data=df, palette="tab10", s=60, alpha=0.7
        )
        plt.title('Resume Clusters Visualization (t-SNE)')
        plt.legend(title='Cluster', bbox_to_anchor=(1.05, 1), loc='upper left')
        plt.tight_layout()
        plt.savefig(f'{output_dir}/cluster_visualization.png')
        print(f"Saved {output_dir}/cluster_visualization.png")
        plt.close()
    else:
        print(f"Columns for Cluster Visualization plot missing. Available: {df.columns.tolist()}")

if __name__ == "__main__":
    generate_plots()
