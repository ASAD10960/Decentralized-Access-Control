from django.urls import path
from .views import (
    UploadAndEncryptRecordView,
    DecryptAndRetrieveRecordView,
    ListPatientRecordsView,
    ListAllRecordsView,
    GetAuditTrailView,
    RevokeRecordView
)

urlpatterns = [
    path('', ListAllRecordsView.as_view(), name='list-all-records'),
    path('upload/', UploadAndEncryptRecordView.as_view(), name='upload-record'),
    path('<str:record_id>/decrypt/', DecryptAndRetrieveRecordView.as_view(), name='decrypt-record'),
    path('<str:record_id>/revoke/', RevokeRecordView.as_view(), name='revoke-record'),
    path('patient/<str:patient_address>/', ListPatientRecordsView.as_view(), name='patient-records'),
    path('audit/', GetAuditTrailView.as_view(), name='all-audit-trail'),
    path('audit/<str:record_id>/', GetAuditTrailView.as_view(), name='record-audit-trail'),
]
