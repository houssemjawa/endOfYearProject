<?php

namespace ClientBundle\Repository;

/*


class PublicationRepository extends \Doctrine\ORM\EntityRepository
{

    public function findByArticle($idArticle){

        $query = $this->createQueryBuilder('p')
            ->select('p.id,p.contenue,p.,a.path')
            ->addselect('a.prix,a.type,a.id as idArticle')

            ->innerJoin('a.Article','a')
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

*/