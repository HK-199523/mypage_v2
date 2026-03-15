from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    SPA（フロントエンド）からのAPIリクエスト用。
    DRFのSessionAuthenticationが行うCSRF検証をスキップする。
    """
    def enforce_csrf(self, request):
        return
