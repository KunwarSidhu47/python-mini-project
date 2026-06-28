"""
Custom exceptions for the security module.
"""


class SecurityValidationError(Exception):
    """Base exception for security validation errors."""
    pass


class InvalidURLError(SecurityValidationError):
    """Raised when URL validation fails."""
    pass


class UnsafeTarError(SecurityValidationError):
    """Raised when tar extraction is unsafe."""
    pass


class SecurityWarning(Warning):
    """Warning for security-related issues."""
    pass 
