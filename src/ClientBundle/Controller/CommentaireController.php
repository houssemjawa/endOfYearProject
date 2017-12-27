<?php

namespace ClientBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\HttpFoundation\JsonResponse ;
use Symfony\Component\HttpFoundation\Request ;
use Symfony\Component\HttpFoundation\Response ;
use ClientBundle\Entity\Commentaire ;

class CommentaireController extends Controller
{





 /**
  *
  * @Rest\View()
  * @Rest\Get("{id_Publication}/Commentaires")
  *
  *
  */

 public function GetCommaintaireAction(Request $request)
 {
$id_Publication = $request->get ('id_Publication') ;
     $Publication = $this->get('doctrine.orm.entity_manager')
         ->getRepository('ClientBundle:Commentaire')
         ->findByPublication($id_Publication ) ;

     if( $Publication) {
         return $Publication;
     }



 }

    /**
     *
     * @Rest\View()
     * @Rest\Post("{id_Publication}/Commentaire/{id_Client}")
     *
     *
     */
    public function PostCommentaireAction(Request $request) {

        $id_Publication = $request->get ('id_Publication') ;
        $Publication = $this->get('doctrine.orm.entity_manager')
            ->getRepository('ClientBundle:Publication')
            ->find($id_Publication) ;
          //dump($Publication) ;die();
$idClient =$request->get('id_Client') ;
$client= $this->get('doctrine.orm.entity_manager')
->getRepository('ClientBundle:Client')->find($idClient) ;
        if($Publication && $client) {
            $Commentaire = new Commentaire() ;
            $Commentaire->setCommentaire($request->get('commentaire')) ;
            $Commentaire->setClient($client) ;
            $Commentaire->setPublication($Publication) ;
            $em =$this->get('doctrine.orm.entity_manager') ;
            $em->persist($Commentaire) ;
            $em->flush() ;
        }else { return new JsonResponse(['message' => 'Publication NOT FOUND'], Response::HTTP_NOT_FOUND);}

    }


    /**
     *
     *
     * @Rest\Delete("/{id_Publication}/Commentaire/{Commentaire_id}")
     *
     *
     *
     */
    public function RemoveCommentaireAction(Request $request)
    {
        $id_Commentaire = $request->get('Commentaire_id');

        $em = $this->get('doctrine.orm.entity_manager');
        $Commentaire = $em->getRepository('ClientBundle:Commentaire')->find($id_Commentaire);
        $Publication = $Commentaire->getPublication();
        $idPublication=$Publication->getId() ;
        if($idPublication==$request->get('id_Publication'))
        {
            $em->remove($Commentaire);
            $em->flush();
            return new JsonResponse(['message' => 'Commentaire Delete'], Response::HTTP_ACCEPTED);
        } else {
            return new JsonResponse(['message' => 'Commentaire NOT FOUND'], Response::HTTP_NOT_FOUND);
        }

    }


    /**
     *
     *
     * @Rest\Put("{id_Publication}/Commentaire/{Commentaire_id}")
     */

    public function UpdateCommentaireAction(Request $request)
    {
        $id_Commentaire = $request->get('Commentaire_id');
        $em = $this->get('doctrine.orm.entity_manager');
        $Commentaire = $em->getRepository('ClientBundle:Commentaire')->find($id_Commentaire);
       // dump($Commentaire) ;die();
        $Publication = $Commentaire-> getPublication() ;
         $idPublication=$Publication->getId() ;
        if($idPublication==$request->get('id_Publication'))
        {
            $Commentaire->setConCommentaire($request->get('ConCommentaire')) ;
            $em->merge($Commentaire);
            $em->flush();
            return new JsonResponse(['message' => 'Commentaire Update'], Response::HTTP_ACCEPTED);
        } else {
            return new JsonResponse(['message' => 'Publication NOT e FOUND'], Response::HTTP_NOT_FOUND);
        }

    }


}
