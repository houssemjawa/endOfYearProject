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
use ClientBundle\Entity\Follow ;
use ClientBundle\Entity\AuthAccessToken;
use ClientBundle\Entity\Publication;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use ClientBundle\Entity\Etablissement;

class EtablissementController extends Controller
{
  /**
  *@Rest\View()
  *@Rest\Post("/register/page")
  */
  public function postEtablissementAction(Request $request){
    $em = $this->get('doctrine.orm.entity_manager');
    $name = $request->get('name');
    $categorie = $request->get('categorie');
    $adresse = $request->get('adresse');

      $about = $request->get('about');
    $admin = $em->getRepository('ClientBundle:Client')->findOneByUsername($request->get('admin'));
    $uploadedfile = $request->files->get('file');
    $directory = __DIR__.'/../../../../pfa_alpha/web/views/uploads/pagePhoto/'.$name;

    foreach($request->files as $uploadedFile) {
        $file = $uploadedFile->move($directory, $uploadedFile->getClientOriginalName());
    }
    $etablissement = new Etablissement();
    $etablissement->setName($name);
    $etablissement->setAdresse($adresse);
    $etablissement->setCategorie($categorie);
    $etablissement->setAdmin($admin);

      $etablissement->setAbout($about);

    $etablissement->setFile($uploadedfile);
    $etablissement->path="./uploads/pagePhoto/".$name."/".$uploadedFile->getClientOriginalName();
    $etablissement->setLat($request->get('lat'));
    $etablissement->setlg($request->get('lg'));
    $etablissement->setAbout($request->get('about'));
    $em->persist($etablissement);
    $em->flush();
    return new JsonResponse(["message" => "created"]);
  }
  /**
  *@Rest\View()
  *@Rest\Get("/stories/{token}")
  */
  public function getStoriesAction(Request $request){
    $em = $this->get('doctrine.orm.entity_manager');
    $auth = $em->getRepository('ClientBundle:AuthAccessToken')->findOneByToken($request->get('token'));
    if(empty($auth)){
        return new JsonResponse(['message' => 'you are not authentified']);
    }
    $id = $auth->getClient()->getId();
    $client = $em->getRepository('ClientBundle:Client')->find($id);
    $qb = $em->createQueryBuilder();
    $likes = $qb->select('f')
    ->from('ClientBundle:Follow', 'f')
    ->join('f.client', 'c')
    ->where('c.id = :clientId')
    ->setParameter('clientId', $client->getId())
    ->getQuery()
    ->getResult();
    $etablissementIds = array();
    foreach ($likes as $like) {
      $etablissementIds[] = $like->getEtablissement()->getId();
    }
    $stories = array();
    foreach ($etablissementIds as $etablissementId) {
      $connection = $em->getConnection();
      $statement = $connection->prepare("SELECT * FROM Publication WHERE id = :id");
      $statement->bindValue('id', $etablissementId);
      $statement->execute();
      $stories[] = $statement->fetchAll();
    }

    return $stories;
}
/**
*@Rest\View()
*@Rest\Get("/page/{id}")
*/
  public function getEtablissementAction(Request $request){
$em = $this->get('doctrine.orm.entity_manager');
$id = $request->get('id');
$result = $em->getRepository('ClientBundle:Etablissement')->find($id);
return $result;
}
/**
*@Rest\View()
*@Rest\Get("/list")
*/
public function getEtablissementsAction(Request $request){
  $em = $this->get('doctrine.orm.entity_manager');
  $results =$em->getRepository('ClientBundle:Etablissement')
            ->findByID();
          return new JsonResponse($results);
}
/**
*@Rest\View()
*@Rest\Get("/search/{donnee}")
*/
  public function getEtablissementsBySearchAction(Request $request){
$em = $this->get('doctrine.orm.entity_manager');
$query = $em->createQuery('SELECT a.id ,a.categorie,a.adresse,a.name,a.path,a.lat,a.lg,a.about FROM ClientBundle:Etablissement a WHERE a.adresse = :adresse OR  a.categorie = :categorie  OR a.name = :name ');
$results = $query->setParameters(array(
    'adresse' => $request->get('donnee'),
    'name' => $request->get('donnee'),
    'categorie' => $request->get('donnee'),))->getResult();
return new  JsonResponse($results) ;
}

//==============================================================
    /**
     * @Rest\View()
     * @Rest\Get("/Restaurant/{resto_Nom}")
     *
     *
     */
    Public function GetRestaurantByIdAction(Request $request)
    {
        $restauNom=$request->get('resto_Nom') ;
        $Restaurant = $this->get('doctrine.orm.entity_manager')->getRepository("ClientBundle:Etablissement")
            ->findByNom($restauNom) ;

        if(!empty($Restaurant))
        {
            return  $Restaurant ;
        }
        else {  new JsonResponse(['message'=>'Not found '],Response::HTTP_NOT_FOUND ) ;}

    }

    //==========================================================




/**
*@Rest\View()
*@Rest\Delete("/page/{id}")
*/
public function deleteEtablissementAction(Request $request){
  $etablissement = $this->get('doctrine.orm.entity_manager')
                  ->getRepository('ClientBundle:Etablissement')
                  ->find($request->get('id'));
          /* @var $place Place */

          if (empty($etablissement)) {
              return new JsonResponse(['message' => 'Contact not found'], Response::HTTP_NOT_FOUND);
          }
          $em = $this->get('doctrine.orm.entity_manager');
          $em->remove($etablissement);
          $em->flush();
          return new JsonResponse(["message" => "contact removed successfully"]);

}
/**
    *@Rest\View()
    *@Rest\Put("/page/{id}")
    */
    public function putEtablissementAction(Request $request){
      $em = $this->get('doctrine.orm.entity_manager');
      $contact = $em->getRepository('ClientBundle:Etablissement')->find($request->get('id'));
          /* @var $place Place */

          if (empty($etablissement)) {
              return new JsonResponse(['message' => 'Contact not found'], Response::HTTP_NOT_FOUND);
          }
          $etablissement->setName($request->get('name'));
          $etablissement->setCategorie($request->get('categorie'));
          $etablissement->setAdresse($request->get('adresse'));
          $etablissement->setAdmin($request->get('admin'));
          $em->merge($etablissement);
          $em->flush();
          return new JsonResponse(["message" => "contact updated"]);
    }
}
