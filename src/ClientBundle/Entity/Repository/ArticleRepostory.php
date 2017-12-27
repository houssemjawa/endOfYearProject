<?php
/**
 * Created by PhpStorm.
 * User: mac
 * Date: 09/02/17
 * Time: 22:15
 */

namespace ClientBundle\Entity\Repository;
use Doctrine\ORM\EntityRepository ;
use ClientBundle\Entity\Etablissement;


class ArticleRepostory extends EntityRepository
{

    //*****************************Find Resto Parmater Nom_resto
    public function finByRestaurant($resto_Nom){
$query = $this->createQueryBuilder('A');
    $query= $query->select('A.id,A.image,A.prix,A.nom, R.Nom,A.TypeArticle')
    ->innerJoin('A.Restaurant','R')
    ->where('R.Nom = :Resto_Nom')
     ->setParameter('Resto_Nom', $resto_Nom);
return $query->getQuery()->getResult();

    }



    //*****************************Find Article Parmater Nom_resto and Id article

    public function findByNom($resto_Nom,$Article_ID)
{
 $query = $this->createQueryBuilder('A');
    $query =$query
        ->select('A')
        ->innerJoin('A.Restaurant','r')
        ->where('A.id=:Article_ID')
        ->andWhere('r.Nom = :Resto_Nom')
        ->setParameter('Resto_Nom',$resto_Nom)
        ->setParameter('Article_ID',$Article_ID) ;

   return $query->getQuery()->getSingleResult() ;

}

//Find  one Article with ther Nom
    public function findOneByNom($NomArticle)
    {
        $query = $this->createQueryBuilder('A') ;
        $query =$query
            ->select('A.id')
            ->where('A.nom =:NomArticle')
            ->setParameter('NomArticle', $NomArticle);
        return $query->getQuery()->getResult();
    }




}