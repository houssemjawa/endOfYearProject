<?php

namespace ClientBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use FOS\UserBundle\Model\User as BaseUser;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Client
 *
 * @ORM\Table(name="client")
 * @ORM\Entity(repositoryClass="ClientBundle\Repository\ClientRepository")
 */
class Client extends BaseUser
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
     protected $phone;
     /**
      * @ORM\Column(type="string", length=255)
      */
    protected $adresse;
      /**
       * @ORM\Column(type="string", length=255)
       */
    protected $nom;
       /**
        * @ORM\Column(type="string", length=255)
        */
    protected $prenom;
    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    public $path;

    /**
     * @Assert\File(maxSize="6000000")
     */
    public $file;

    public function getAbsolutePath()
    {
        return null === $this->path
            ? null
            : $this->getUploadRootDir().'/'.$this->path;
    }

    public function getWebPath()
    {
        return null === $this->path
            ? null
            : $this->getUploadDir().'/'.$this->path;
    }

    protected function getUploadRootDir()
    {
        // the absolute directory path where uploaded
        // documents should be saved
        return __DIR__.'/../../../../web/'.$this->getUploadDir();
    }

    protected function getUploadDir()
    {
        // get rid of the __DIR__ so it doesn't screw up
        // when displaying uploaded doc/image in the view.
        return 'uploads/documents';
    }

    /**
     * Sets file.
     *
     * @param UploadedFile $file
     */
    public function setFile(UploadedFile $file = null)
    {
        $this->file = $file;
    }
    /**
     * Get file.
     *
     * @return UploadedFile
     */
    public function getFile()
    {
        return $this->file;
    }

    public function getId()
    {
        return $this->id;
    }
    public function getPhone(){
      return $this->phone;
    }
    public function setPhone($phone){
      $this->phone = $phone;
    }
    public function getAdresse(){
      return $this->adresse;
    }
    public function setAdresse($adresse){
      $this->adresse = $adresse;
    }
    public function getNom(){
      return $this->nom;
    }
    public function setNom($nom){
      $this->nom = $nom;
    }
    public function getPrenom(){
      return $this->prenom;
    }
    public function setPrenom($prenom){
      $this->prenom = $prenom;
    }



}
