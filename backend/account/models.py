from django.db import models
from django.contrib.auth.models import (BaseUserManager, AbstractBaseUser)


# class UserManager(BaseUserManager):
#     def create_user(self, email, date_of_birth, password=None):
#         if not email:
#             raise ValueError('Users must have an email address')

#         user = self.model(
#             email=self.normalize_email(email),
#             date_of_birth=date_of_birth,
#         )

#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, email, date_of_birth, password):
#         user = self.create_user(
#             email,
#             password=password,
#             date_of_birth=date_of_birth,
#         )
#         user.is_admin = True
#         user.save(using=self._db)
#         return user


# # AbstractBaseUser: 내가 쓴것만
# # AbstractUser: 원래 있던 필드도
# class User(AbstractBaseUser):
#     email = models.EmailField(
#         verbose_name='email',
#         max_length=255,
#         unique=True,
#     )
#     date_of_birth = models.DateField()
#     is_active = models.BooleanField(default=True)
#     is_admin = models.BooleanField(default=False)

#     objects = UserManager()

#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = ['date_of_birth']

#     # 관리자 페이지에서 객체 표시할 때 사용
#     def __str__(self):
#         return self.email

#     # 사용자가 특정 권한 가지고 있는지
#     def has_perm(self, perm, obj=None):
#         return True

#     # 사용자가 특정 앱의 모든 모듈 권한을 가지고 있는지
#     def has_module_perms(self, app_label):
#         return True

#     # 사용자가 관리자인지
#     @property
#     def is_staff(self):
#         return self.is_admin