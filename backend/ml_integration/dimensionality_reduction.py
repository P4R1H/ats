"""Dimensionality reduction using PCA and t-SNE for visualization."""
import joblib
import numpy as np
from pathlib import Path
from typing import Tuple, Dict, List
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.preprocessing import StandardScaler

# Lazy imports
_pca_model = None
_tsne_model = None
_scaler = None


def reduce_dimensions_pca(
    X: np.ndarray,
    n_components: int = 2,
    random_state: int = 42
) -> Tuple[np.ndarray, PCA, float]:
    """
    Reduce dimensionality using PCA (Principal Component Analysis).

    PCA is a linear dimensionality reduction technique that preserves
    global structure and maximum variance.

    Args:
        X: Feature matrix (n_samples, n_features)
        n_components: Number of components to keep (default: 2 for visualization)
        random_state: Random seed for reproducibility

    Returns:
        Tuple of (reduced_data, pca_model, explained_variance_ratio)
    """
    # Standardize features (important for PCA)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Fit PCA
    pca = PCA(n_components=n_components, random_state=random_state)
    X_reduced = pca.fit_transform(X_scaled)

    # Calculate total explained variance
    explained_variance = sum(pca.explained_variance_ratio_)

    return X_reduced, pca, explained_variance


def reduce_dimensions_tsne(
    X: np.ndarray,
    n_components: int = 2,
    perplexity: int = 30,
    random_state: int = 42,
    n_iter: int = 1000
) -> Tuple[np.ndarray, TSNE]:
    """
    Reduce dimensionality using t-SNE (t-Distributed Stochastic Neighbor Embedding).

    t-SNE is a non-linear dimensionality reduction technique that preserves
    local structure better than PCA.

    Args:
        X: Feature matrix (n_samples, n_features)
        n_components: Number of components to keep (default: 2 for visualization)
        perplexity: Balance between local and global structure (default: 30)
        random_state: Random seed for reproducibility
        n_iter: Number of iterations (default: 1000)

    Returns:
        Tuple of (reduced_data, tsne_model)
    """
    # Standardize features (recommended for t-SNE)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Fit t-SNE
    tsne = TSNE(
        n_components=n_components,
        perplexity=perplexity,
        random_state=random_state,
        n_iter=n_iter,
        verbose=0
    )
    X_reduced = tsne.fit_transform(X_scaled)

    return X_reduced, tsne


def visualize_clusters(
    X: np.ndarray,
    cluster_labels: np.ndarray,
    method: str = 'tsne',
    perplexity: int = 30,
    random_state: int = 42
) -> Dict[str, any]:
    """
    Reduce dimensions and prepare data for cluster visualization.

    Args:
        X: Feature matrix (n_samples, n_features)
        cluster_labels: Cluster assignments for each sample
        method: 'pca' or 'tsne' (default: 'tsne')
        perplexity: t-SNE perplexity parameter (ignored for PCA)
        random_state: Random seed

    Returns:
        Dictionary with visualization data:
        - coordinates: 2D coordinates [[x1, y1], [x2, y2], ...]
        - cluster_labels: Cluster assignments
        - method: Reduction method used
        - explained_variance: Only for PCA (fraction of variance explained)
    """
    if method.lower() == 'pca':
        X_reduced, model, explained_var = reduce_dimensions_pca(
            X, n_components=2, random_state=random_state
        )
        return {
            'coordinates': X_reduced.tolist(),
            'cluster_labels': cluster_labels.tolist() if hasattr(cluster_labels, 'tolist') else list(cluster_labels),
            'method': 'PCA',
            'explained_variance': float(explained_var),
            'component_1_label': 'PC1',
            'component_2_label': 'PC2'
        }
    elif method.lower() == 'tsne':
        X_reduced, model = reduce_dimensions_tsne(
            X, n_components=2, perplexity=perplexity, random_state=random_state
        )
        return {
            'coordinates': X_reduced.tolist(),
            'cluster_labels': cluster_labels.tolist() if hasattr(cluster_labels, 'tolist') else list(cluster_labels),
            'method': 't-SNE',
            'perplexity': perplexity,
            'component_1_label': 'Dimension 1',
            'component_2_label': 'Dimension 2'
        }
    else:
        raise ValueError(f"Unknown method: {method}. Use 'pca' or 'tsne'")


def calculate_pca_components(
    X: np.ndarray,
    n_components: int = None
) -> Dict[str, any]:
    """
    Calculate PCA components and explained variance for analysis.

    Args:
        X: Feature matrix (n_samples, n_features)
        n_components: Number of components (default: min(n_samples, n_features))

    Returns:
        Dictionary with PCA analysis results
    """
    # Standardize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Fit PCA with all components
    if n_components is None:
        n_components = min(X.shape[0], X.shape[1])

    pca = PCA(n_components=n_components)
    X_transformed = pca.fit_transform(X_scaled)

    # Calculate cumulative explained variance
    cumulative_variance = np.cumsum(pca.explained_variance_ratio_)

    return {
        'n_components': n_components,
        'explained_variance_ratio': pca.explained_variance_ratio_.tolist(),
        'cumulative_variance': cumulative_variance.tolist(),
        'singular_values': pca.singular_values_.tolist(),
        'components_for_90_percent': int(np.argmax(cumulative_variance >= 0.9) + 1),
        'components_for_95_percent': int(np.argmax(cumulative_variance >= 0.95) + 1)
    }


def save_reduction_model(
    model: any,
    method: str,
    filename: str = None
) -> str:
    """
    Save dimensionality reduction model to disk.

    Args:
        model: PCA or t-SNE model
        method: 'pca' or 'tsne'
        filename: Custom filename (optional)

    Returns:
        Path to saved model file
    """
    models_dir = Path(__file__).parent.parent.parent / 'ml' / 'models'
    models_dir.mkdir(parents=True, exist_ok=True)

    if filename is None:
        filename = f'{method.lower()}_model.pkl'

    model_path = models_dir / filename
    joblib.dump(model, model_path)

    return str(model_path)


def load_reduction_model(method: str, filename: str = None) -> any:
    """
    Load dimensionality reduction model from disk.

    Args:
        method: 'pca' or 'tsne'
        filename: Custom filename (optional)

    Returns:
        Loaded model
    """
    models_dir = Path(__file__).parent.parent.parent / 'ml' / 'models'

    if filename is None:
        filename = f'{method.lower()}_model.pkl'

    model_path = models_dir / filename

    if not model_path.exists():
        raise FileNotFoundError(f"Model not found: {model_path}")

    return joblib.load(model_path)


def batch_reduce_and_visualize(
    features_list: List[np.ndarray],
    cluster_labels_list: List[np.ndarray],
    labels: List[str],
    method: str = 'both'
) -> Dict[str, any]:
    """
    Reduce dimensions for multiple datasets and prepare comparison visualization.

    Args:
        features_list: List of feature matrices
        cluster_labels_list: List of cluster labels (parallel to features_list)
        labels: List of dataset labels (e.g., ['K-means', 'Hierarchical'])
        method: 'pca', 'tsne', or 'both' (default: 'both')

    Returns:
        Dictionary with visualization data for all datasets
    """
    results = {}

    for i, (X, clusters, label) in enumerate(zip(features_list, cluster_labels_list, labels)):
        if method in ['pca', 'both']:
            pca_viz = visualize_clusters(X, clusters, method='pca')
            results[f'{label}_pca'] = pca_viz

        if method in ['tsne', 'both']:
            tsne_viz = visualize_clusters(X, clusters, method='tsne')
            results[f'{label}_tsne'] = tsne_viz

    return results


def optimal_perplexity(n_samples: int) -> int:
    """
    Calculate optimal t-SNE perplexity based on dataset size.

    Perplexity should be between 5 and 50, with typical values around 30.
    For small datasets, use lower perplexity.

    Args:
        n_samples: Number of samples in dataset

    Returns:
        Recommended perplexity value
    """
    if n_samples < 30:
        return max(5, n_samples // 3)
    elif n_samples < 100:
        return 15
    elif n_samples < 500:
        return 30
    else:
        return 50
