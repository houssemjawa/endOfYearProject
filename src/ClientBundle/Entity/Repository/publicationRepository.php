<?php

/**
 * Created by PhpStorm.
 * User: joujou
 * Date: 4/20/17
 * Time: 7:00 PM
 */

namespace ClientBundle\Entity\Repository;
use Doctrine\ORM\EntityRepository ;
use ClientBundle\Entity\Publication ;



class publicationRepository extends EntityRepository
{

    /**
     * @param string $resto_Nom
     */

    public function findByArticle($idArticle){

        $query = $this->createQueryBuilder('p')
            ->select('p.id,p.content,p.datetime,a.path')
            ->addselect('a.prix,a.type,a.id as idArticle')

            ->innerJoin('p.article','a')
            ->where('a.nom =:idArticle')
            ->setParameter('idArticle' ,$idArticle) ;
        return  $query ->getQuery()->getResult();
    }

    //find Publication have same id Article
    public function findOneByArticle($NomArticle,$Publication_id)
    {
        $query =$this->createQueryBuilder('P');
        $query->select('P')
            ->innerJoin('P.Article', 'a')
            ->where('a.nom =:NomArticle')
            ->andWhere('P.id= :Publication_id')
            ->setParameter('NomArticle', $NomArticle)
            ->setParameter('Publication_id', $Publication_id);
        return $query->getQuery()->getResult();

    }

}