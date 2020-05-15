
sudo systemctl start mongod


iframe me block pour faire ce que je veux
    on va etre obliger de faire avec un form maison

il faut faire ses form maison pour pouvoir faire ce que l'on veut.
Et je branche tout a air table.
je ferais aussi des request pour avoir ce dont on a besoin.
f020f6839182a61f01e97e568f70659f87c6065f5c50f711e74d4e0f7c194a59
9e5b6d248a018153e014222e044822afa0a6b260fb350957d04c7ac892374e5e

curl -F grant_type=authorization_code \
-F client_id=0946e3081c8a54463edb047f605cbe7f2895f6cbd191f8224214dc570ae5061c \
-F client_secret=ec38cb375f1d0c2e54e1fa7231d35b3adfde010865d843911a943a834a9b1920 \
-F code=7493bbf439b7a26f902c6c80fd8e3d3fc75dc6bd14d7457339b1c2c311c05fef \
-F redirect_uri=http://localhost:3000/42auth \
-X POST https://api.intra.42.fr/oauth/token
