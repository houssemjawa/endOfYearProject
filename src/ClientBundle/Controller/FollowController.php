<?php


namespace ClientBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\Head;
use FOS\RestBundle\Controller\Annotations\Put;
use FOS\RestBundle\Controller\Annotations\Delete;
use FOS\RestBundle\Controller\Annotations\Post;
use FOS\RestBundle\Controller\Annotations\Patch;
use FOS\RestBundle\View\ViewHandler;
use FOS\RestBundle\View\View;
use FOS\RestBundle\Controller\Annotations as Rest;
use ClientBundle\Entity\Client ;
use ClientBundle\Entity\AuthAccessToken;
use ClientBundle\Entity\Publication;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
class FollowController extends Controller
{

    /**
     *
     *@Rest\View()
     * @Rest\Get("{id_etablissements}/follow/{id_Client} ")
     */
    public function Getfollow(Request $request)
    {

        $follow= $this->get('doctrine.orm.entity_manager')->getRepository('ClientBundle:Follow')->findByetablissement($request->get('id_Client'),$request->get('id_etablissements')) ;

        if(empty($follow)) {
          return new JsonResponse(['message' => 'Etablissement not found'], Response::HTTP_NOT_FOUND);;
    }
    else {
      return  ($follow)  ;
    }

    }
}

