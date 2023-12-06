  
import os
from flask_admin import Admin
from .models import db, User, ContactRequest, Favorites
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(AllColumn(User, db.session))
    admin.add_view(ModelView(ContactRequest, db.session))
    admin.add_view(favView(Favorites, db.session))
    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))

class AllColumn(ModelView):
    column_display_pk = True

class favView(ModelView):
    column_display_pk = True
    column_hide_backrefs = False

    