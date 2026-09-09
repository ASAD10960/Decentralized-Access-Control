from django.urls import path
from .views import (
    AttributeListView,
    DoctorRegisterView,
    DoctorListView,
    IssueDoctorKeyView,
    GetDoctorKeyByWalletView,
    EvaluatePolicyView
)

urlpatterns = [
    path('attributes/', AttributeListView.as_view(), name='attribute-list'),
    path('doctors/', DoctorListView.as_view(), name='doctor-list'),
    path('doctors/register/', DoctorRegisterView.as_view(), name='doctor-register'),
    path('doctors/<int:doctor_id>/issue-key/', IssueDoctorKeyView.as_view(), name='issue-key'),
    path('doctors/by-wallet/<str:wallet_address>/', GetDoctorKeyByWalletView.as_view(), name='doctor-by-wallet'),
    path('evaluate-policy/', EvaluatePolicyView.as_view(), name='evaluate-policy'),
]
