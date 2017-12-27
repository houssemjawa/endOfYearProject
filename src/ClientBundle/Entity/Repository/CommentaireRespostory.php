<?php
/**
 * Created by PhpStorm.
 * User: mac
 * Date: 04/04/17
 * Time: 17:17
 */

namespace ClientBundle\Entity\Repository;
use Doctrine\ORM\EntityRepository ;

class CommentaireRespostory extends  EntityRepository
{

    public function findByPublication($idpublication) {

    $query = $this->createQueryBuilder('C');
    $query = $query
        ->select('C.ConCommentaire,C.dateCom,C.id')

        ->addSelect('P.id as IdPublication')
      ->addSelect('client.path as path')
        ->innerJoin('C.Publication','P')
        ->innerJoin('C.client','client')
        ->where('P.id = :idpublication')
        ->setParameter('idpublication', $idpublication) ;
    return $query->getQuery()->getResult() ;

}

}