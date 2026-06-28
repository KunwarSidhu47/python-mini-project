"""
Security module with centralized validation and sanitization.

This module provides secure wrappers for vulnerable standard library functions:
- URL validation (addressing CVE-2025-0938)
- Safe tar extraction (addressing CVE-2025-4435)
"""

from .exceptions import (
    SecurityValidationError,
    InvalidURLError,
    UnsafeTarError,
    SecurityWarning,
)

from .url_sanitizer import (
    URLSanitizer,
    validate_url,
)

from .tar_safe import (
    SafeTarExtractor,
    safe_extract,
)

__all__ = [
    'SecurityValidationError',
    'InvalidURLError',
    'UnsafeTarError',
    'SecurityWarning',
    'URLSanitizer',
    'validate_url',
    'SafeTarExtractor',
    'safe_extract',
]

__version__ = '1.0.0' 
