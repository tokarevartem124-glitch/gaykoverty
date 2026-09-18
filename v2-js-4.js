// final user-facing copy cleanup for the preview build
const catalogLead=document.querySelector('#catalog .section-lead');
if(catalogLead) catalogLead.textContent='Заказ можно собрать прямо на странице — несколько товаров и любое количество. Здесь показана компактная выборка популярных моделей; полный ассортимент доступен у менеджера и на основном сайте.';
const catalogNote=document.querySelector('#catalog .catalog-note');
if(catalogNote) catalogNote.textContent='Наличие и цена подтверждаются перед заказом';
document.querySelectorAll('#filterChips .chip').forEach(btn=>{if(!['all','1/2"'].includes(btn.dataset.filter)) btn.remove();});
const deliveryFaq=[...document.querySelectorAll('.faq-item')].find(x=>x.querySelector('.faq-q')?.textContent.includes('Как считается доставка'));
if(deliveryFaq){const p=deliveryFaq.querySelector('.faq-a p');if(p)p.textContent='Самовывоз — без стоимости доставки. Курьер по Екатеринбургу и транспортная компания рассчитываются менеджером после оформления заказа.';}
const checkoutStatus=document.getElementById('checkoutStatus');
if(checkoutStatus) checkoutStatus.textContent='После оформления откроется готовое письмо с составом заказа. Отправьте его менеджеру — он подтвердит наличие, доставку и оплату.';
