from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsStaffOrReadOnly(BasePermission):
    """
    スタッフ以上は読み書き可能。
    一般ユーザー（閲覧者）はGET/HEAD/OPTIONSのみ許可。
    未認証ユーザーは拒否。
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_staff or request.user.is_superuser


class IsSuperuser(BasePermission):
    """スーパーユーザーのみ許可"""
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.is_superuser
        )
