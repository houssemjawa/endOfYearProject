<?php

namespace ClientBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use ClientBundle\Entity\Client;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Etablissement
 *
 * @ORM\Table(name="etablissement")
 * @ORM\Entity(repositoryClass="ClientBundle\Entity\Repository\EtablissementRepository")
 */
class Etablissement
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     *
     * @ORM\Column(name="categorie", type="string", length=255)
     */
    private $categorie;

    /**
    * @var string
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;
    /**
     * @var text
     *
     * @ORM\Column(name="about", type="text")
     */
    private $about;

    /**
     * @var string
     *
     * @ORM\Column(name="adresse", type="string", length=255)
     */
    private $adresse;

    /**
     * @var float
     *
     * @ORM\Column(name="lat", type="float")
     */
    private $lat;
    /**
     * @var float
     *
     * @ORM\Column(name="lg", type="float")
     */
    private $lg;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    public $path;

    /**
     * @Assert\File(maxSize="6000000")
     */
    private $file;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set type
     *
     * @param string $categorie
     *
     * @return Etablissement
     */
    public function setCategorie($categorie)
    {
        $this->categorie = $categorie;

        return $this;
    }

    /**
     * Get categorie
     *
     * @return string
     */
    public function getCategorie()
    {
        return $this->categorie;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Etablissement
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set adresse
     *
     * @param string $adresse
     *
     * @return Etablissement
     */
    public function setAdresse($adresse)
    {
        $this->adresse = $adresse;

        return $this;
    }

    /**
     * Get adresse
     *
     * @return string
     */
    public function getAdresse()
    {
        return $this->adresse;
    }
    /**
     * Set lat
     *
     * @param float $lat
     *
     * @return Etablissement
     */
    public function setLat($lat)
    {
        $this->lat = $lat;

        return $this;
    }

    /**
     * Get lat
     *
     * @return float
     */
    public function getLat()
    {
        return $this->lat;
    }
    /**
     * Set lg
     *
     * @param   float $lg
     *
     * @return Etablissement
     */
    public function setlg($lg)
    {
        $this->lg = $lg;

        return $this;
    }

    /**
     * Get lg
     *
     * @return float
     */
    public function getlg()
    {
        return $this->lg;
    }

     /**
      * @ORM\OneToOne(targetEntity="Client")
      * @ORM\JoinColumn(name="admin_id", referencedColumnName="id")
      */
      private $admin;
      public function setAdmin($admin){
        $this->admin = $admin;
      }
      public function getAdmin(){
        return $this->admin;
      }
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
      public function getAbout(){
        return $this->about;
      }
      public function setAbout($about){
        $this->about = $about;
      }



}
