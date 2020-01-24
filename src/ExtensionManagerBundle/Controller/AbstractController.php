<?php
/**
 * Created by PhpStorm.
 * User: Yulius Ardian Febrianto <yuliusardin@gmail.com>
 * Date: 03/12/2019
 * Time: 15:06
 */

namespace SaltId\ExtensionManagerBundle\Controller;

use Pimcore\Controller\FrontendController;
use Pimcore\Model\User;
use Pimcore\Tool\Session;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpKernel\Exception\HttpException;

abstract class AbstractController extends FrontendController
{
    public function onKernelController(FilterControllerEvent $event)
    {
        parent::onKernelController($event);

        $session = Session::getReadOnly();
        $user = $session->get('user');
        if (!$user instanceof User) {
            throw new HttpException(401, 'NO NO NO AUTH ');
        }
    }
}