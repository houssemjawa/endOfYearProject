<?php

namespace ClientBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * @ORM\Entity()
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="ClientBundle\Entity\Repository\publicationRepository")
 */
class Publication
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    public $id;

     /**
      * @ORM\Column(type="text")
      */
     public $content;
     /**
      * @var \DateTime
      *
      * @ORM\Column(name="datetime", type="datetime")
      */
     private $datetime;

     public function setDatetime($datetime)
     {
         $this->datetime = $datetime;

         return $this;
     }

     /**
      * Get datetime
      *
      * @return \DateTime
      */
     public function getDatetime()
     {
         return $this->datetime;
     }






    public function setContent($content){
      $this->content = $content;
    }
    /**
     * Get file.
     *
     * @return text
     */
    public function getContent(){
      return $this->content;
    }
    /**
     * @ORM\OneToMany(targetEntity="Commentaire",mappedBy = "publication");
     */
     public $commentaires;


    /**
     * @ORM\ManyToOne(targetEntity="Article")
     * @ORM\JoinColumn(nullable=false,name="article",referencedColumnName="id")
     */

    public $article ;

    /**
     * @return mixed
     */
    public function getArticle()
    {
        return $this->article;
    }

    /**
     * @param mixed $article
     */
    public function setArticle($article)
    {
        $this->article = $article;
    }

public function __construct() {
$this->datetime = new \DateTime();
}

    /**
     * @return mixed
     */
    public function getCommentaires()
    {
        return $this->commentaires;
    }
}
