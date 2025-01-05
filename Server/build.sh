set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py migrate

# only one time for populating the data base
# python manage.py create_users

# python manage.py create_posts

# needed for the first time to create superuser
# if [[ $CREATE_SUPERUSER ]];
# then
#     python manage.py createsuperuser --no-input
# fi