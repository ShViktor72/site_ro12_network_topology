import test from 'node:test';import assert from 'node:assert/strict';
import {chooseMedium,diagnosePhysical,linkQuality,media} from '../src/physicalNetwork.ts';
import {sectionNavigation,sections} from '../src/config.ts';
test('второй раздел доступен и содержит 13 последовательных шагов',()=>{const section=sections.find(x=>x.id==='physical');assert.equal(section?.status,'available');const items=sectionNavigation.physical;assert.equal(items.length,13);assert.ok(items.every(x=>x.status==='available'&&x.includeInSequence))});
test('среда выбирается по длине, помехам и мобильности',()=>{assert.equal(media.length,3);assert.equal(chooseMedium(80,false,false),'utp');assert.equal(chooseMedium(150,false,false),'fiber');assert.equal(chooseMedium(30,true,false),'fiber');assert.equal(chooseMedium(20,false,true),'wifi')});
test('диагностика начинает с физической проверки',()=>{assert.match(diagnosePhysical('no-light').first,/питание/i);assert.match(diagnosePhysical('flapping').first,/тестер/i);assert.match(diagnosePhysical('ok').first,/канального/i)});
test('качество линии ухудшается при дефектах',()=>{assert.equal(linkQuality(50,0,false).score,100);assert.ok(linkQuality(100,1,true).score<50)});
