const Sauce = require('../models/Sauce');

const fs = require('fs');

//Création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        _userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    
    sauce.save()
        .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
        .catch(error => { res.status(400).json( { error })})
};

//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,        
    } : { ...req.body };

    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if(sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    console.log('image suppriméé!')
                });
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Sauce modifiée!'}))
                .catch(error => res.status(401).json({ 'error' : 'not authorized' }));
            }
        })
        .catch((error) => {res.status(400).json({ error});
        });
};

//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Sauce supprimé !'})})
                        .catch(error => res.status(401).json({ 'error' : 'Not authorized'}));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ 'error' : 'Not authorized' });
        });
};

//Récupération d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ 'error' : 'Not authorized'}));
};

//Récupération des sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ 'error' : 'Not authorized' }));
};

//Like/Dislike sauce
exports.likeOrDislike =(req, res, next) => {
Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        
    if (req.body.like === 1) {
        if(!sauce.usersLiked.length){ 
            sauce.usersLiked = [req.auth.userId];
            sauce.likes++;
        }
        else if (sauce.usersLiked.indexOf(req.auth.userId) === -1){
            sauce.likes ++;
            sauce.usersLiked.push(req.auth.userId);
        }
        else {
            throw new Error ("Vous avez déjà liker!");
        }
    }
    if (req.body.like === 0){
        if(sauce.usersLiked.indexOf(req.auth.userId) != -1){
            sauce.likes--;
            sauce.usersLiked.splice((sauce.usersLiked.indexOf(req.auth.userId)),1);
        }
        else if(sauce.usersDisliked.indexOf(req.auth.userId) != -1){
            sauce.dislikes--;
            sauce.usersDisliked.splice((sauce.usersDisliked.indexOf(req.auth.userId)),1);
        }
    }
    if (req.body.like === -1) {
        if(!sauce.usersDisliked.length){ 
            sauce.usersDisliked = [req.auth.userId];
            sauce.dislikes++;
        }
        else if (sauce.usersDisliked.indexOf(req.auth.userI) === -1){
            sauce.dislikes ++;
            sauce.usersDisliked.push(req.auth.userId);
        }
        else if (sauce.usersLiked.indexOf(req.auth.userId)){
            throw new Error ("Vous n'êtes pas autorisés!");
        }
    }
    
    Sauce.updateOne({ _id: req.params.id}, sauce)
        .then(() => res.status(200).json({message : 'modification des likes!'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch( error => {
        res.status(500).json({ 'error' : 'Not authorized'});
        console.log("error", error);
    });
}


        
    
  