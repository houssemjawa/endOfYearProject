<?php
/**
 * Created by PhpStorm.
 * User: mac
 * Date: 04/04/17
 * Time: 11:08
 */

namespace UserBundle\Entity\Repository ;
use Doctrine\ORM\EntityRepository ;


class UserObserRepostory extends EntityRepository
{

    public function findByUsername($Pseudo,$password)
    {
        $query = $this->createQueryBuilder('U');
        $query = $query
            ->select('U.Pseudo,U.Email,U.Nom')
            ->where('U.username = :Pseudo')
            ->andWhere('U.password= :password')
            ->setParameter('Pseudo', $Pseudo)
            ->setParameter('password', $password);
        return $query->getQuery()->getSingleResult() ;

    }


}