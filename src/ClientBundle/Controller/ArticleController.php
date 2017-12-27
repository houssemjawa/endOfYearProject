<?php

namespace ClientBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\HttpFoundation\JsonResponse ;
use Symfony\Component\HttpFoundation\Request ;
use Symfony\Component\HttpFoundation\Response ;
use ClientBundle\Entity\Article ;

class ArticleController extends Controller
{

    //***************************** Get ALL Article on the reseto

    /**
     *
     *@Rest\View()
     * @Rest\Get("/{resto_Nom}/Articles")
     */
    public function GetArticleAction(Request $request)
    {

        $id_article = $this->get('doctrine.orm.entity_manager')->getRepository('ClientBundle:Article')->findByEtablissement($request->get('resto_Nom')) ;
        if(empty($id_article)) {
          return new JsonResponse(['message' => 'Etablissement not found'], Response::HTTP_NOT_FOUND);;
    }
    else {
      return  ($id_article)  ;
    }

    }


    //*****************************Get article7
        /**
     *
     * @Rest\View()
     * @Rest\Get("/{Resto_Nom}/Article/{Article_id}")
     */
    public function GetArticleIdAction(Request $request)
    {
        $Article = $this->getDoctrine()->getRepository('ClientBundle:Article')->findbyNom($request->get('Resto_Nom'), $request->get('Article_id'));
        if (empty($Article)) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        return ($Article);
    }


  /**
     * @Rest\View()
     * @Rest\Get("Article/{Client_id}")
     */
    public function GetArticlebyClient(Request $request){
$em = $this->get('doctrine.orm.entity_manager');
        $Client = $em->getRepository('ClientBundle:Client')->findOneById($request->get('Client_id')) ;
    
      $etablissement = $em->getRepository('ClientBundle:Etablissement')->findOneByAdmin($Client) ;
   
        $Articles = $this->get('doctrine.orm.entity_manager')->getRepository('ClientBundle:Article')->findByEtablissement($etablissement->getName()) ;
           if(empty($Articles)) {
          return new JsonResponse(['message' => 'Etablissement not found'], Response::HTTP_NOT_FOUND);;
    }
    else {
      return  ($Articles)  ;
    }
    }



    /**
    *@Rest\View()
    *@Rest\Post("/Article/{id_Client}")
    */
    public function ArticleAction(Request $request){
      $em = $this->get('doctrine.orm.entity_manager');
      $auth = $em->getRepository('ClientBundle:AuthAccessToken')->findOneByToken($request->get('token'));
$name = $request->get('nom') ;
      if(empty($auth)){
          return new JsonResponse(['message' => 'you are not authentified']);
      }
      $uploadedfile = $request->files->get('file');
      $directory = __DIR__.'/../../../../pfa_alpha/web/views/uploads/Article/'.$name;
      foreach($request->files as $uploadedFile) {
          $file = $uploadedFile->move($directory, $uploadedFile->getClientOriginalName());
      }
      $Client = $em->getRepository('ClientBundle:Client')->findOneById($request->get('id_Client')) ;
    
      $etablissement = $em->getRepository('ClientBundle:Etablissement')->findOneByAdmin($Client) ;
     
      if(!empty($etablissement)) {
$article =  new Article() ;
 $article->setPrix($request->get('prix')) ;
 $article->setType($request->get('type')) ;
 $article->setNom($request->get('nom')) ;
 $article->setetablissement($etablissement);
     $article->setFile($uploadedfile);
     $article->path="./uploads/Article/".$name."/".$uploadedFile->getClientOriginalName();
     $em->persist($article);
     $em->flush();
     return new JsonResponse(['ok']);
   }else{return new JsonResponse(["message" => "error"]);}

      }
    











    //*****************************Post Article on restaurant
    /**
     *@Rest\View()
     * @Rest\Post("/{Resto_Nom}/Article")
     *
     */

    public function PostArticleAction(Request $request)
    {




$Nom=$request->get('Resto_Nom');
        $em= $this->get('doctrine.orm.entity_manager') ;
        $Resto = $em->getRepository('ClientBundle:Etablissement')->findByNom($Nom) ;

        if (!empty($Resto)) {
            $Article = new Article();
            $em = $this->get('doctrine.orm.entity_manager');
            $Article->setNom($request->get('nom'));
            $Article->setPrix($request->get('prix'));
            $Article->setPath($request->get('path'));
          $Article->Etablissement =$Resto;
            $em->persist($Article);
            $em->flush();
            return new JsonResponse(['message' => 'Artile create'], Response::HTTP_ACCEPTED);
        } else {return new JsonResponse(['message' => 'Resto Not found '], Response::HTTP_NOT_FOUND);}
    }


    //*****************************Delete Article
    /**
     *
     * @Rest\Delete("{Resto_Nom}/Article/{Article_id}")
     */
    public function RemoveArticleAction(Request $request)
    {


        $Article= $this->getDoctrine()
            ->getRepository('ClientBundle:Article')
        ->findbyNom($request->get('Resto_Nom'), $request->get('Article_id'));

        if ($Article) {
                $em  = $this->get('doctrine.orm.entity_manager') ;
                $em->remove($Article);
                $em->flush();
                return new JsonResponse(['message' => 'Article Delete'], Response::HTTP_ACCEPTED);
            } else {
                return new JsonResponse(['message' => 'Article NOT FOUND'], Response::HTTP_NOT_FOUND);
            }

    }

    //*****************************Delete Article #A complite
    /**
     *
     *
     * @Rest\Put("{Resto_Nom}/Article/{Article_id}")
     *
     *
     */
    public function UpdateArticleAction(Request $request)
    {

        $Nom=$request->get('Resto_Nom');
        $em= $this->get('doctrine.orm.entity_manager') ;
        $Resto = $em->getRepository('ClientBundle:Etablissement')->findByNom($Nom) ;

            if (!empty($Resto)) {

                $Article=$this->get('doctrine.orm.entity_manager')
                ->getRepository('ClientBundle:Article')
                    ->find($request->get('Article_id'));

                if(!empty($Article)){

                $Article->setNom($request->get('nom'));
                $Article->setPrix($request->get('prix'));
               // dump($Article); die() ;
                 $em = $this->get('doctrine.orm.entity_manager');
                $em->merge($Article);
                $em->flush();
                return new JsonResponse(['message' => 'Article update'], Response::HTTP_ACCEPTED);
            } else {return new JsonResponse(['message' => 'Article NOT FOUND'], Response::HTTP_NOT_FOUND);}

        }else {return new JsonResponse(['message' => 'Resto NOT FOUND'], Response::HTTP_NOT_FOUND); }
    }


}
