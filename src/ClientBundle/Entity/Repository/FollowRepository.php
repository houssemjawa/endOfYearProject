<?php

namespace ClientBundle\Entity\Repository;

use Doctrine\ORM\EntityRepository ;
use ClientBundle\Entity\Follow ;


class FollowRepository extends EntityRepository
{

    /**
     * @param string $resto_Nom
     */
    public function findByetablissement($client,$Publication_id)
    {
       
  $query =$this->createQueryBuilder('f');
        $query->select('f.id')
            ->innerJoin('f.client', 'client')
             ->innerJoin('f.etablissement', 'etablissement')
            ->where('client.id =:idClient')
            ->andWhere('etablissement.id= :idetablissement')
            ->setParameter('idClient', $client)
            ->setParameter('idetablissement', $Publication_id);
        return $query->getQuery()->getResult();
    

    }
}
