<?php
/**
 * Created by PhpStorm.
 * User: mac
 * Date: 04/04/17
 * Time: 11:12
 */

namespace UserBundle\Entity\Repository;
use Doctrine\ORM\EntityRepository ;

class UserRepostory extends EntityRepository
{
    public function findByUsername($Pseudo,$password)
    {
        $query = $this->createQueryBuilder('U');
        $query = $query
            ->select('U.email')
            ->where('U.username = :username')

            ->setParameter('username', $Pseudo);

        return $query->getQuery()->getSingleResult() ;

    }

}