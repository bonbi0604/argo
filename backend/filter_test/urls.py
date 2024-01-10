from django.urls import path, include
from . import views
from .views import recommendation_view

urlpatterns = [
    path('recommendation_view/', recommendation_view, name='recommendation_view'),
]