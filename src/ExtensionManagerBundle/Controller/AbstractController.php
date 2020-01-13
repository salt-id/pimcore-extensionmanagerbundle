<?php
/**
 * Created by PhpStorm.
 * User: Yulius Ardian Febrianto <yuliusardin@gmail.com>
 * Date: 03/12/2019
 * Time: 15:06
 */

namespace SaltId\ExtensionManagerBundle\Controller;

use Pimcore\Controller\FrontendController;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;

abstract class AbstractController extends FrontendController
{
    public function onKernelController(FilterControllerEvent $event)
    {
        parent::onKernelController($event);
    }
}