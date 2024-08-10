<template>
  <div>
    <v-file-input
      v-model="file"
      :accept="accept"
      :label="label"
      @click:clear="onClear"
      @change="onFileChange"
      single-line
      :hint="initial && initial.name"
      :persistent-hint="!!initial"
      v-bind="$attrs"
    >
      <template v-slot:append-outer>
        <v-btn @click="openModal" icon color="primary">
          <v-icon>mdi-eye</v-icon>
        </v-btn>
      </template>
    </v-file-input>
    <v-dialog v-model="isPreviewOpen" max-width="800" persistent>
      <v-card style="overflow-x: hidden">
        <v-card-title>File Preview</v-card-title>
        <div
          v-if="isImage"
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 500px;
          "
        >
          <v-img :src="previewSrc" class="responsive-image" />
        </div>
        <div v-else>
          <iframe
            frameborder="0"
            :src="previewSrc"
            width="100%"
            height="500px"
          ></iframe>
        </div>
        <v-card-actions>
          <v-btn color="error" text @click="closeModal">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, PropType } from 'vue';
import { client } from "../../services/dispatch-client";

interface FilesDto {
  id?: string;
  name: string;
  type: string;
  data: string;
}

export default defineComponent({
  props: {
    image: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "Select File",
    },
    initial: {
      type: Object as PropType<FilesDto>,
    },
  },
  setup(props, { emit }) {
    const isPreviewOpen = ref(false);
    const file = ref<File | undefined>();
    const previewSrc = ref("");
    
    const isImage = computed(() => {
      if (props.image) return true;
      if (file.value) return file.value.type.startsWith("image/");
      if (props.initial) return props.initial.type.startsWith("image/");
      return false;
    });

    const accept = computed(() => {
      return props.image ? "image/*" : "*/*";
    });

    const onClear = () => {
      file.value = undefined;
      emit("change", undefined);
    };

    const openModal = () => {
      isPreviewOpen.value = true;
    };

    const closeModal = () => {
      isPreviewOpen.value = false;
    };

    const onFileChange = (newFile?: File) => {
      file.value = newFile;
      emit("change", newFile);
    };

    watch(file, (newFile) => {
      if (newFile) {
        const reader = new FileReader();
        reader.readAsDataURL(newFile);
        reader.onload = (event) => {
          if (event.target?.result) {
            previewSrc.value = event.target.result as string;
          }
        };
      }
    });

    watch(
      () => props.initial,
      async (dto) => {
        if (dto?.id) {
          const resp = await client.getDataURL(dto.id);
          previewSrc.value = resp.response;
        }
      },
      { immediate: true }
    );

    return {
      isPreviewOpen,
      file,
      previewSrc,
      isImage,
      accept,
      onClear,
      openModal,
      closeModal,
      onFileChange,
    };
  },
});
</script>

<style scoped>
.responsive-image {
  display: block;
  max-width: 100%;
  max-height: 100%;
  margin: auto;
  height: auto;
}
</style>
