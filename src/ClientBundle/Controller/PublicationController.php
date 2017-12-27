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

class PublicationController extends Controller
{
  /**
   *@Rest\View()
   *@Rest\Post("/share")
   */
    public function postPublicationAction(Request $request){
    $publication = new Publication();
    $uploadedfile = $request->files->get('file');
    $em = $this->get('doctrine.orm.entity_manager');
    $publication->name=$uploadedFile->getClientOriginalName();
    $publication->path=$directory.$uploadedFile->getClientOriginalName();
    $publication->setContent($request->get('content'));
    $token = $request->get('token');
    $auth = $em->getRepository('ClientBundle:AuthAccessToken')->findOneByToken($request->get('token'));
    if(empty($auth)){
        return new JsonResponse(['message' => 'you are not authentified']);
    }
    $id = $auth->getClient()->getId();
    $client = $em->getRepository('ClientBundle:Client')->find($id);
    $etablissement = $em->getRepository('ClientBundle:Etablissement')->findOneByAdmin($client);
    $publication->setEtablissement($etablissement);
    $directory = __DIR__.'/../../../../web/uploads/publications/'.$etablissement->getName();

    foreach($request->files as $uploadedFile) {
        $file = $uploadedFile->move($directory, $uploadedFile->getClientOriginalName());
    }
    $publication->setFile($uploadedfile);

    $em->persist($publication);
    $em->flush();
    return new JsonResponse(["message" => "image uploaded"]);
  }
  /**
   *@Rest\View()
   *@Rest\Put("/stories/{id}/{token}")
   */
   public function putStorieAction(Request $request){
     $em = $this->get('doctrine.orm.entity_manager');
     $token = $request->get('token');
     $auth = $em->getRepository('ClientBundle:AuthAccessToken')->findOneByToken($request->get('token'));
     $id_client = $auth->getClient()->getId();
     $id_publication = $request->get('id');
     $publication = $em->getRepository('ClientBundle:Publication')->find($id_publication);
     $id_admin = $publication->getEtablissement()->getAdmin()->getId();
     if ($id_client != $id_admin){
       return new JsonResponse(['message' => 'you cant do this'], Response::HTTP_NOT_FOUND);
     }
     $publication->setContent($request->get('content'));
     $em->merge($publication);
     $em->flush();
     return $publication;
   }
   /**
    *@Rest\View()
    *@Rest\Delete("/stories/{id}/{token}")
    */
    public function deletePublicationAction(Request $request){
      $em = $this->get('doctrine.orm.entity_manager');
      $token = $request->get('token');
      $auth = $em->getRepository('ClientBundle:AuthAccessToken')->findOneByToken($request->get('token'));
      $id_client = $auth->getClient()->getId();
      $id_publication = $request->get('id');
      $publication = $em->getRepository('ClientBundle:Publication')->find($id_publication);
      $id_admin = $publication->getEtablissement()->getAdmin()->getId();
      if ($id_client != $id_admin){
        return new JsonResponse(['message' => 'you cant do this'], Response::HTTP_NOT_FOUND);
      }
      $em->remove($publication);
      $em->flush();
      return new JsonResponse(['message' => 'deleted successfully']);
    }
    /**
     *@Rest\View()
     *@Rest\Get("/stories/{id}/{token}")
     */
     public function getOnePublicationAction(Request $request){
       $em = $this->get('doctrine.orm.entity_manager');
       $token = $request->get('token');
       $auth = $em->getRepository('ClientBundle:AuthAccessToken')->findOneByToken($request->get('token'));
       if (empty($auth)){
         return new JsonResponse(['message' => 'you are not authentified'], Response::HTTP_NOT_FOUND);
       }
       $publication = $em->getRepository('ClientBundle:Publication')->find($request->get('id'));
       return $publication ;
     }

//========================================================================pour===========


//************************Get  Publication with Article
    /**
     *@Rest\View()
     *@Rest\Get("{nom_Article}/publications")
     *
     */

    Public function GetPublicationAction(Request $request)
{

$nom_article =$request->get('nom_Article') ;

    $em = $this->get('doctrine.orm.entity_manager') ;
    $public=$em->getRepository('ClientBundle:Publication')->findByArticle($nom_article);

        return  $public;
}

//******************************//************************Get  Publication with Article ID

    /**
     * @Rest\View()
     *@Rest\Get("{Nom_Article}/publication/{id_Publication}")
     *
     */
    public function GetPublicationIdAction(Request $request)
    {
        $id_Publication = $request->get('id_Publication');
        $em = $this->get('doctrine.orm.entity_manager');
        $Publication = $em->getRepository('ClientBundle:Publication')->find($id_Publication);
        $article1 = $Publication->getArticle();
        $NomArticle=$article1->getNom();
        dump($article1);die() ;
        if($NomArticle==$request->get('Nom_Article'))
        {
            return   $Publication ;

        }else{  return new JsonResponse(['message' => 'Publication not found'], Response::HTTP_NOT_FOUND);}


    }

//****************************Post publication in Article

    /**
     * @Rest\View()
     *@Rest\Post("{id_article}/publication")
     *
     */

    public function PostPublication(Request $request)
    {

        $Nom_article =$request->get('id_article') ;
        $em = $this->get('doctrine.orm.entity_manager') ;
        $article=$em->getRepository('ClientBundle:Article')->find($Nom_article);
        if(!empty($article)) {
            $publicaton =new Publication() ;
            $publicaton->setContent($request->get('content'));
            $publicaton->setArticle($article) ;
            $em->persist($publicaton);
            $em->flush();
            return new JsonResponse(Response::HTTP_ACCEPTED) ;
        }else { return new JsonResponse(['message' => 'Artilce not found'], Response::HTTP_NOT_FOUND); }

    }



//**************************************Remove Publication
    /**
     * @Rest\View()
     * @Rest\Delete("{Nom_Article}/publication/{Publication_id}")
     */
    public function RemovePublicationAction(Request $request)
    {

        $id_Publication = $request->get('Publication_id');
        $em = $this->get('doctrine.orm.entity_manager');
        $Publication = $em->getRepository('ClientBundle:Publication')->find($id_Publication);
        if(!empty($Publication)) {
            $article = $Publication->getArticle();
            if(!empty( $article)) {
                $NomArticle = $article->getNom();
                if ($NomArticle == $request->get('Nom_Article')) {
                    $em->remove($Publication);
                    $em->flush();
                    return new JsonResponse(['message' => 'Publication Delete'], Response::HTTP_ACCEPTED);
                } else {
                    return new JsonResponse(['message' => 'Publication NOT FOUND'], Response::HTTP_NOT_FOUND);
                }
            }else{return new JsonResponse(['message' => 'Publication NOT e FOUND'], Response::HTTP_NOT_FOUND); }

        }else {return new JsonResponse(['message' => 'Publication NOT e FOUND'], Response::HTTP_NOT_FOUND);}
    }


    //**************************************Update Publication

    /**
     * @Rest\View()
     * @Rest\Put("{Nom_Article}/publication/{Publication_id}")
     */

    public function UpdatePublicationAction(Request $request)
    {
        $id_Publication = $request->get('Publication_id');
        $em = $this->get('doctrine.orm.entity_manager');
        $Publication = $em->getRepository('ClientBundle:Publication')->find($id_Publication);

        $article = $Publication->getArticle();

        $NomArticle=$article->getNom();
        if($NomArticle==$request->get('Nom_Article'))
        {
            $Publication->setContent($request->get('content'));
            $em->merge($Publication);
            $em->flush();
            return new JsonResponse(['message' => 'Publication Update'], Response::HTTP_ACCEPTED);
        } else {
            return new JsonResponse(['message' => 'Publication NOT e FOUND'], Response::HTTP_NOT_FOUND);
        }

    }










}
