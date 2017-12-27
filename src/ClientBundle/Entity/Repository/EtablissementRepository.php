<?php
/**
 * Created by PhpStorm.
 * User: mac
 * Date: 10/02/17
 * Time: 21:06
 */

namespace ClientBundle\Entity\Repository;

use Doctrine\ORM\EntityRepository ;
use ClientBundle\Entity\Etablissement ;


class EtablissementRepository extends EntityRepository
{

    /**
     * @param string $resto_Nom
     */
    public function findByID()
    {
        $query= $this->createQueryBuilder('a');
        $query= $query
            ->select('a.id ,a.categorie ,a.adresse,a.name,a.path,a.lat,a.lg,a.about') ;

        return $query->getQuery()->getResult() ;

    }



    //*****************************Find Id Parmater Nom_resto

    /**
     * @param string $resto_Nom
     */
  public function findByNom($resto)
    {
   $query= $this->createQueryBuilder('a');
        $query= $query
            ->select('a.id ,a.categorie ,a.adresse,a.name,a.path,a.lat,a.long,a.about')
            ->where('a.name = :Resto')
            ->setParameter('Resto',$resto) ;

        return $query->getQuery()->getResult() ;

    }


}
