<script setup lang="ts">
const props = defineProps<{
    missmissingMap: Map<string, number>,
    notRecognizedMap: Map<string, number>,
    overExtendsMap: Map<string, number>,
    shapeMap: Map<string, string>
    percentValueFirst: number,
    percentValueSecond: number,
}>();

const firstLevel = useState<string>();
const secondLevel = useState<string>();
const thirdLevel = useState<string>();
const firstLevelPercent = useState<string>();
const secondLevelPercent = useState<string>();
const thirdLevelPercent = useState<string>();

const colorClassLevel1 = useState<string>(() =>'step step-error');
const colorClassLevel2 = useState<string>(() =>'step step-error');
const colorClassLevel3 = useState<string>(() =>'step step-error');


if (props.missmissingMap.size === 0 && props.notRecognizedMap.size === 0 && props.overExtendsMap.size === 0) {
    firstLevel.value = '✓';
    firstLevelPercent.value= props.percentValueFirst.toString();
    colorClassLevel1.value = 'step step-accent';
} else {
    firstLevel.value = '✕';
    firstLevelPercent.value= props.percentValueFirst.toFixed(2);
    colorClassLevel1.value = 'step step-error';
}

if (props.missmissingMap.size === 0 && props.notRecognizedMap.size === 0 && props.overExtendsMap.size === 0 && props.shapeMap.size === 0) {
    secondLevel.value = '✓';
    secondLevelPercent.value= props.percentValueSecond.toString();
    colorClassLevel2.value = 'step step-accent';
} else {
    secondLevel.value = '✕';
    secondLevelPercent.value= props.percentValueSecond.toFixed(2);
    colorClassLevel2.value = 'step step-error';
}


</script>

<template>
  <div>
<!--      <h3 class='text-2xl font-bold mt-4 mb-4'>Analyze result</h3>-->
    <div class='' v-if='missmissingMap.size === 0 && notRecognizedMap.size === 0 && overExtendsMap.size === 0 && shapeMap.size === 0'>
        <AlertSuccess>Analyze successfull</AlertSuccess>
        <ul class="steps w-full justify-center mt-4">
            <li :data-content='firstLevel' :class= 'colorClassLevel1'>Level 1 - {{ firstLevelPercent }}%</li>
            <li :data-content='secondLevel' :class= 'colorClassLevel2'>Level 2 - {{ secondLevelPercent }}%</li>
            <li :data-content='thirdLevel' :class= 'colorClassLevel3'>Level 3</li>
        </ul>
    </div>
      <div class='mt-4' v-else>
          <div class="alert alert-warning shadow-lg">
              <div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span>Current diagram has some problems:</span>
              </div>
          </div>
          <ul class="steps w-full justify-center mt-4">
              <li :data-content='firstLevel' :class= 'colorClassLevel1'>Level 1 - {{ firstLevelPercent }}%</li>
              <li :data-content='secondLevel' :class= 'colorClassLevel2'>Level 2 -{{ secondLevelPercent }}%</li>
              <li :data-content='thirdLevel' :class= 'colorClassLevel3'>Level 3</li>
          </ul>
          <div v-if='missmissingMap.size !== 0'>
              <h1 class='text-2xl font-bold mt-3 text-center mb-2'>Missing elements</h1>
              <div v-for="(value, key) in props.missmissingMap" :key="key">
                  <p class='text-lg text-center mt-2'>{{ value[0] }} - {{ value[1] }} time(s)</p>
              </div>

          </div>

          <div v-if='notRecognizedMap.size !== 0'>
              <h1 class='text-2xl font-bold mt-3 text-center mb-2'>Not recognized elements</h1>
              <div v-for="(value, key) in props.notRecognizedMap" :key="key">
                  <p class='text-lg text-center'>{{ value[0] }} - {{ value[1] }} time(s)</p>
              </div>

          </div>

          <div v-if='overExtendsMap.size !== 0'>
              <h1 class='text-2xl font-bold mt-3 text-center mb-2'>Extra elements</h1>
              <div v-for="(value, key) in props.overExtendsMap" :key="key">
                  <p class='text-lg text-center'>{{ value[0] }} - {{ value[1] }} time(s)</p>
              </div>
          </div>

          <div v-if='shapeMap.size !== 0'>
              <h1 class='text-2xl font-bold mt-3 text-center mb-3'>Shape elements</h1>
              <div v-for="(value, key) in props.shapeMap" :key="key">
                  <p class='text-lg text-center'>ID: <span class='font-bold'>{{ value[0] }}</span> should be: <span class='font-bold'>{{ value[1] }}</span> shape</p>
              </div>
          </div>
      </div>
      <div class='flex justify-center mt-4'>
          <!--          <div class="radial-progress bg-neutral text-primary-content border-4 border-neutral" :style="`&#45;&#45;value:${props.percentValue}; &#45;&#45;size:8rem; &#45;&#45;thickness: 1rem;`">{{ props.percentValue }}%</div>-->
<!--          <progress class="progress progress-success w-56" :value="`${ props.percentValue }`" max="100"></progress>-->
      </div>
  </div>

</template>
