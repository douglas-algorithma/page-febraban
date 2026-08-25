/**
 * Registro de cenas 3D. Contrato 3.
 *
 * Chave = valor de `scene3d` no manifesto. Para criar uma cena nova:
 *   1. escreva o modulo exportando `criar(ctx)` que devolve
 *      { scene, camera, update(dt,t), resize(w,h), dispose() }
 *   2. registre aqui
 *   3. aponte `scene3d` para a chave no manifesto
 * Nenhum outro arquivo precisa saber.
 */
import aneisCard from './aneis-card.js'
import rodaMandala from './roda-mandala.js'
import campoParticulas from './campo-particulas.js'
import aberturaPilar from './abertura-pilar.js'
import orbitaPilares from './orbita-pilares.js'
import ondasBarras from './ondas-barras.js'
import seloFinal from './selo-final.js'
import campoLime from './campo-lime.js'

export const REGISTRY = {
  'aneis-card': aneisCard,
  'roda-mandala': rodaMandala,
  'campo-particulas': campoParticulas,
  'abertura-pilar': aberturaPilar,
  'orbita-pilares': orbitaPilares,
  'ondas-barras': ondasBarras,
  'selo-final': seloFinal,
  'campo-lime': campoLime
}

export const idsRegistrados = () => Object.keys(REGISTRY)
