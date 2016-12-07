# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

<<<<<<< HEAD
    dependencies = [
        ('core', '0016_auto_20160724_2344'),
    ]
=======
    dependencies = [('core', '0016_auto_20160724_2344'), ]
>>>>>>> 51e3a3a85781b47f6dc44f6bec10b7a87a589095

    operations = [
        migrations.AddField(
            model_name='delegate',
            name='friday_attendance',
<<<<<<< HEAD
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='delegate',
            name='saturday_afternoon_attendance',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='delegate',
            name='saturday_morning_attendance',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='delegate',
            name='sunday_attendance',
            field=models.BooleanField(default=False),
        ),
=======
            field=models.BooleanField(default=False), ),
        migrations.AddField(
            model_name='delegate',
            name='saturday_afternoon_attendance',
            field=models.BooleanField(default=False), ),
        migrations.AddField(
            model_name='delegate',
            name='saturday_morning_attendance',
            field=models.BooleanField(default=False), ),
        migrations.AddField(
            model_name='delegate',
            name='sunday_attendance',
            field=models.BooleanField(default=False), ),
>>>>>>> 51e3a3a85781b47f6dc44f6bec10b7a87a589095
    ]
